// Cloud save for ticks: stores {done, saved} under a private sync code chosen by the user.
// Secrets never live in this repo. The database URL and token come from Vercel environment
// variables that Vercel adds when an Upstash Redis database is connected to the project.
const crypto = require("crypto");

const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const ID = /^[a-z0-9]{1,40}$/;        // place ids look like "stabbs", "lochleven"
const CODE = /^[A-Z0-9]{6,40}$/;      // sync codes: 6–40 letters or numbers
const MAX_ITEMS = 500;
const RATE_LIMIT = 60;                // requests per minute per visitor

async function redis(cmd) {
  const r = await fetch(DB_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${DB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("storage " + r.status);
  return (await r.json()).result;
}

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const cleanIds = (a) =>
  Array.isArray(a) ? [...new Set(a.filter((x) => typeof x === "string" && ID.test(x)))].slice(0, MAX_ITEMS) : [];

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // non-browser clients; still rate limited below
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

async function overLimit(req) {
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const key = `rl:${sha(ip).slice(0, 24)}:${Math.floor(Date.now() / 60000)}`;
  const n = await redis(["INCR", key]);
  if (n === 1) await redis(["EXPIRE", key, 70]);
  return n > RATE_LIMIT;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Not allowed" });
  if (!DB_URL || !DB_TOKEN) return res.status(503).json({ error: "Cloud storage is not connected yet" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Bad request" });

  const code = String(body.code || "").trim().toUpperCase();
  if (!CODE.test(code)) return res.status(400).json({ error: "Code must be 6–40 letters or numbers" });
  const key = "sf:" + sha(code);

  try {
    if (await overLimit(req)) return res.status(429).json({ error: "Too many requests, try again in a minute" });
    if (body.action === "set") {
      const data = { done: cleanIds(body.done), saved: cleanIds(body.saved), updated: Date.now() };
      await redis(["SET", key, JSON.stringify(data)]);
      return res.status(200).json(data);
    }
    const raw = await redis(["GET", key]);
    return res.status(200).json(raw ? JSON.parse(raw) : { done: [], saved: [], updated: 0 });
  } catch {
    return res.status(502).json({ error: "Could not reach cloud storage" });
  }
};
