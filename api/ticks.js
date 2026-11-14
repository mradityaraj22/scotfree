// Cloud save for ticks: stores {done, saved} under a private sync code chosen by the user.
//
// Secrets never live in this repo. All of them are Vercel environment variables:
//   KV_REST_API_URL / KV_REST_API_TOKEN  added by Vercel when Upstash Redis is connected
//   SYNC_SECRET                          optional but recommended: a long random string. Codes are
//                                        stored as HMAC(SYNC_SECRET, code), so even someone holding a
//                                        copy of the database cannot test guesses for codes.
const crypto = require("crypto");

const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const SECRET = process.env.SYNC_SECRET || "";

const ID = /^[a-z0-9]{1,40}$/;        // place ids look like "stabbs", "lochleven"
const CODE = /^[A-Z0-9]{6,40}$/;      // sync codes: 6–40 letters or numbers
const MAX_ITEMS = 500;
const MAX_BODY = 20000;               // bytes
const RATE_LIMIT = 60;                // requests per minute per visitor
const BACKUP_TTL = 60 * 60 * 24 * 30; // keep the previous version for 30 days

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
const hmac = (s) => crypto.createHmac("sha256", SECRET).update(s).digest("hex");
const keyFor = (code) => (SECRET ? "sf2:" + hmac(code) : "sf:" + sha(code));
const legacyKey = (code) => "sf:" + sha(code);
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

async function load(code) {
  const key = keyFor(code);
  let raw = await redis(["GET", key]);
  if (!raw && SECRET) {
    // One-time move of data saved before SYNC_SECRET was set.
    const old = legacyKey(code);
    raw = await redis(["GET", old]);
    if (raw) { await redis(["SET", key, raw]); await redis(["DEL", old]); }
  }
  return raw;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Not allowed" });
  if (!String(req.headers["content-type"] || "").startsWith("application/json"))
    return res.status(415).json({ error: "Send JSON" });
  if (Number(req.headers["content-length"] || 0) > MAX_BODY) return res.status(413).json({ error: "Too large" });
  if (!DB_URL || !DB_TOKEN) return res.status(503).json({ error: "Cloud storage is not connected yet" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Bad request" });

  const code = String(body.code || "").trim().toUpperCase();
  if (!CODE.test(code)) return res.status(400).json({ error: "Code must be 6–40 letters or numbers" });

  try {
    if (await overLimit(req)) return res.status(429).json({ error: "Too many requests, try again in a minute" });
    const key = keyFor(code);

    if (body.action === "set") {
      const data = { done: cleanIds(body.done), saved: cleanIds(body.saved), updated: Date.now() };
      const prev = await load(code);
      if (prev) await redis(["SET", key + ":prev", prev, "EX", BACKUP_TTL]);
      await redis(["SET", key, JSON.stringify(data)]);
      return res.status(200).json(data);
    }
    if (body.action === "undo") {
      const prev = await redis(["GET", key + ":prev"]);
      if (!prev) return res.status(404).json({ error: "No earlier version saved" });
      await redis(["SET", key, prev]);
      return res.status(200).json(JSON.parse(prev));
    }
    const raw = await load(code);
    return res.status(200).json(raw ? JSON.parse(raw) : { done: [], saved: [], updated: 0 });
  } catch {
    return res.status(502).json({ error: "Could not reach cloud storage" });
  }
};
