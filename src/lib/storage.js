// The only place that touches browser storage directly. Every call is guarded so it is
// safe during server rendering, in private mode, or when storage is full.
const hasWindow = () => typeof window !== "undefined";

export function readJSON(key, fallback = null, area = "local") {
  if (!hasWindow()) return fallback;
  try {
    const raw = (area === "session" ? window.sessionStorage : window.localStorage).getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}
export function writeJSON(key, value, area = "local") {
  if (!hasWindow()) return false;
  try { (area === "session" ? window.sessionStorage : window.localStorage).setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
export function removeKey(key, area = "local") {
  if (!hasWindow()) return;
  try { (area === "session" ? window.sessionStorage : window.localStorage).removeItem(key); } catch { /* ignore */ }
}
