// Fixed "today" keeps demo data deterministic across refreshes.
// Use the actual current date in the user's local timezone.
export const TODAY = (() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
})();

const MS = 86400000;
export const parse = (iso) => new Date(`${iso}T00:00:00Z`);
export const toISO = (d) => d.toISOString().slice(0, 10);
export const addDays = (iso, n) =>
  toISO(new Date(parse(iso).getTime() + n * MS));
export const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / MS);
export const daysAgo = (iso) => daysBetween(iso, TODAY);

export function ageInMonths(dob, on = TODAY) {
  const a = parse(dob),
    b = parse(on);
  return (
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
    (b.getUTCMonth() - a.getUTCMonth()) -
    (b.getUTCDate() < a.getUTCDate() ? 1 : 0)
  );
}

export function ageLabel(dob) {
  const m = ageInMonths(dob);
  const y = Math.floor(m / 12),
    r = m % 12;
  return y ? `${y}y${r ? ` ${r}m` : ""}` : `${r}m`;
}

export const fmtDate = (
  iso,
  opts = { day: "numeric", month: "short", year: "numeric" },
) =>
  iso
    ? parse(iso).toLocaleDateString("en-IN", { ...opts, timeZone: "UTC" })
    : "—";

export const fmtShort = (iso) =>
  fmtDate(iso, { day: "numeric", month: "short" });

export function relativeDay(iso) {
  const d = daysBetween(TODAY, iso);
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d === -1) return "Yesterday";
  return d > 0 ? `In ${d} days` : `${-d} days ago`;
}

// "Today, 10:45" / "Yesterday, 16:30" / "3 Oct, 09:00" for activity feeds and notifications.
export function stampLabel(at) {
  const day = at.slice(0, 10),
    time = at.slice(11, 16);
  const d = daysBetween(TODAY, day);
  const label = d === 0 ? "Today" : d === -1 ? "Yesterday" : fmtShort(day);
  return time ? `${label}, ${time}` : label;
}
