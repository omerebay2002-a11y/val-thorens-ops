// "טופל" on a guest-reported issue in Ops: the status is saved in the shared maintenance_issues table through
// Eitan's view (stoliski-eitan /api/issues), which also updates the guestIssues copy in this app's Firebase.
// The access key stays server-side in EITAN_ACCESS_KEY.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const key = process.env.EITAN_ACCESS_KEY || "";
  if (!key) return res.status(503).json({ error: "החיבור לתקלות לא הוגדר" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const id = body && body.id, status = body && body.status;
  if (!UUID.test(String(id || "")) || !["done", "in_progress"].includes(status)) return res.status(400).json({ error: "בקשה לא תקינה" });
  try {
    const r = await fetch("https://stoliski-eitan.vercel.app/api/issues", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: "eitan_access=" + key },
      body: JSON.stringify({ action: "update", id, status }),
      signal: AbortSignal.timeout(20000),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || d.error || !d.issue) return res.status(502).json({ error: d.error || "השמירה לא הצליחה" });
    return res.status(200).json({ ok: true, status: d.issue.status, updated_at: d.issue.updated_at });
  } catch (e) {
    return res.status(502).json({ error: "התקלות אינן זמינות כרגע" });
  }
};
