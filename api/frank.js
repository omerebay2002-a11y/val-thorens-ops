// Read-only bridge to Frank's repair interface (vt-repairs.vercel.app).
// The access key stays server-side in the FRANK_READ_KEY env var; only task ids, titles and V/X status leave.
const TASKS = require("./frank-tasks.json").tasks;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).end();
  const key = process.env.FRANK_READ_KEY || "";
  let marks = [];
  let state = "not_configured";
  if (key) {
    try {
      const r = await fetch("https://vt-repairs.vercel.app/api/marks?k=" + encodeURIComponent(key), { signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error(String(r.status));
      const data = await r.json();
      if (!Array.isArray(data)) throw new Error("shape");
      marks = data
        .filter((m) => m && typeof m.task_id === "string" && ["open", "done", "cant_fix"].includes(m.status))
        .map((m) => ({ task_id: m.task_id, status: m.status, updated_at: m.updated_at || null })); // notes stay in Frank's keyed interface
      state = "ok";
    } catch (e) {
      state = "unavailable";
    }
  }
  res.status(200).json({ state, checkedAt: new Date().toISOString(), tasks: TASKS, marks });
};
