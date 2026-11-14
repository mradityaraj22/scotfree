// Cloud save for ticks. Stores {done, saved} under a shared sync code (e.g. "YOURCODE").
// Needs an Upstash Redis database connected to the Vercel project (Storage tab, free tier).
const crypto = require("crypto");

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const ID = /^[a-z0-9]{1,40}$/;

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("redis " + r.status);
  return (await r.json()).result;
}
const cleanIds = (a) => (Array.isArray(a) ? [...new Set(a.filter((x) => typeof x === "string" && ID.test(x)))].slice(0, 500) : []);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!URL_ || !TOKEN) return res.status(503).json({ error: "Cloud storage is not connected yet" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const code = String((body && body.code) || "").trim().toUpperCase();
  if (code.length < 4 || code.length > 40) return res.status(400).json({ error: "Code must be 4–40 characters" });
  const key = "sf:" + crypto.createHash("sha256").update(code).digest("hex");

  try {
    if (body.action === "set") {
      const data = { done: cleanIds(body.done), saved: cleanIds(body.saved), updated: Date.now() };
      await redis(["SET", key, JSON.stringify(data)]);
      return res.status(200).json(data);
    }
    const raw = await redis(["GET", key]);
    return res.status(200).json(raw ? JSON.parse(raw) : { done: [], saved: [], updated: 0 });
  } catch (e) {
    return res.status(502).json({ error: "Could not reach cloud storage" });
  }
};
