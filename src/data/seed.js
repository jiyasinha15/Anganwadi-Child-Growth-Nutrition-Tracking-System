// Deterministic demo data. All names are fictional. This is demonstration data only.
import { TODAY, addDays } from "../lib/dates";

export const centres = [
  { id: "c1", name: "Anganwadi Centre 01", short: "Centre 01", location: "Village Road, Sohna", status: "Active" },
  { id: "c2", name: "Anganwadi Centre 02", short: "Centre 02", location: "Station Road, Sohna", status: "Active" },
  { id: "c3", name: "Anganwadi Centre 03", short: "Centre 03", location: "Main Market, Badshahpur", status: "Active" },
  { id: "c4", name: "Anganwadi Centre 04", short: "Centre 04", location: "Canal Colony, Farrukhnagar", status: "Inactive" },
];

export const workers = [
  { id: "w1", name: "Priya Yadav", centre: "c1", role: "Anganwadi Worker", status: "Active", lastActive: `${TODAY}T08:42` },
  { id: "w2", name: "Sunita Devi", centre: "c1", role: "Helper", status: "Active", lastActive: `${TODAY}T09:15` },
  { id: "w3", name: "Meena Kumari", centre: "c2", role: "Anganwadi Worker", status: "Active", lastActive: `${addDays(TODAY, -1)}T16:30` },
  { id: "w4", name: "Rekha Sharma", centre: "c3", role: "Anganwadi Worker", status: "Active", lastActive: `${addDays(TODAY, -2)}T11:05` },
  { id: "w5", name: "Kavita Singh", centre: "c3", role: "Supervisor", status: "Inactive", lastActive: `${addDays(TODAY, -19)}T10:00` },
  { id: "w6", name: "Anita Chauhan", centre: "c4", role: "Anganwadi Worker", status: "Inactive", lastActive: `${addDays(TODAY, -34)}T10:00` },
];

export const CURRENT_WORKER = workers[0];

// scenario: healthy | stable | monitoring | missing | new
// start: months of history; last: days since last measurement
const roster = [
  ["Aarav Kumar", "2021-05-12", "Male", "Ravi Kumar", "c1", "monitoring"],
  ["Ananya Singh", "2020-11-08", "Female", "Pooja Singh", "c1", "healthy"],
  ["Vivaan Sharma", "2022-01-22", "Male", "Neha Sharma", "c2", "stable"],
  ["Diya Verma", "2021-08-30", "Female", "Anil Verma", "c1", "healthy"],
  ["Kabir Yadav", "2020-03-14", "Male", "Suresh Yadav", "c1", "missing"],
  ["Myra Gupta", "2022-06-03", "Female", "Rinku Gupta", "c2", "healthy"],
  ["Reyansh Meena", "2021-02-19", "Male", "Dinesh Meena", "c2", "monitoring"],
  ["Saanvi Rao", "2020-09-27", "Female", "Lata Rao", "c3", "stable"],
  ["Arjun Chauhan", "2021-12-05", "Male", "Mahesh Chauhan", "c3", "healthy"],
  ["Ishita Das", "2022-03-18", "Female", "Bimal Das", "c1", "stable"],
  ["Vihaan Joshi", "2020-07-09", "Male", "Kamla Joshi", "c2", "missing"],
  ["Navya Patel", "2021-10-21", "Female", "Hitesh Patel", "c3", "healthy"],
  ["Advait Nair", "2022-09-11", "Male", "Sreeja Nair", "c1", "new"],
  ["Kiara Mishra", "2021-04-02", "Female", "Alok Mishra", "c1", "monitoring"],
  ["Ayaan Khan", "2020-12-16", "Male", "Farida Khan", "c2", "healthy"],
  ["Tara Bhatt", "2022-02-25", "Female", "Gopal Bhatt", "c3", "stable"],
  ["Rudra Saini", "2021-06-14", "Male", "Seema Saini", "c1", "missing"],
  ["Pari Tiwari", "2022-11-30", "Female", "Jyoti Tiwari", "c2", "new"],
  ["Dhruv Malik", "2020-05-07", "Male", "Naresh Malik", "c3", "healthy"],
  ["Zoya Ansari", "2021-09-08", "Female", "Imran Ansari", "c1", "stable"],
];

const MONTHS = { healthy: 6, stable: 6, monitoring: 6, missing: 5, new: 1 };
const LAST_GAP = { healthy: 6, stable: 12, monitoring: 9, missing: 52, new: 3 };

function ageMonthsAt(dob, iso) {
  const [y1, m1] = dob.split("-").map(Number), [y2, m2] = iso.split("-").map(Number);
  return (y2 - y1) * 12 + (m2 - m1);
}

const SLOPE = { healthy: 0.4, stable: 0.2, monitoring: 0.25, missing: 0.3, new: 0.3 };

function buildMeasurements(i, dob, scenario) {
  const n = MONTHS[scenario];
  const lastDate = addDays(TODAY, -(LAST_GAP[scenario] + (i % 4)));
  const mLast = Math.max(ageMonthsAt(dob, lastDate), 12);
  const lastW = 9.4 + (mLast - 12) * 0.1 + 1.6;
  const lastH = 76 + (mLast - 12) * 0.45;
  // Monitoring children: two consecutive declines (priority review) or one flat interval (needs monitoring).
  const declines = scenario === "monitoring" ? (i % 3 === 0 ? 2 : 1) : 0;
  const out = [];
  for (let k = 0; k < n; k++) {
    const back = n - 1 - k;
    const date = addDays(lastDate, -30 * back);
    const jitter = ((i * 7 + k * 3) % 5 - 2) * 0.03;
    let weight = lastW - back * SLOPE[scenario] + jitter;
    if (declines === 2) weight = lastW + [0, 0.2, 0.45][Math.min(back, 2)] - Math.max(0, back - 2) * 0.3;
    if (declines === 1) weight = lastW - (back ? 0.05 + (back - 1) * 0.3 : 0);
    const height = lastH - back * 0.45 + jitter * 4;
    out.push({ date, height: Number(height.toFixed(1)), weight: Number(weight.toFixed(1)) });
  }
  return out;
}

export const seedChildren = roster.map(([name, dob, gender, guardian, centre, scenario], i) => {
  const centreObj = centres.find((c) => c.id === centre);
  const measurements = buildMeasurements(i, dob, scenario);
  return {
    id: String(i + 1),
    name, dob, gender, guardian,
    phone: `98${String(76500000 + i * 13579).slice(0, 8)}`,
    centreId: centre,
    center: centreObj.name, // legacy field used by older pages
    address: centreObj.location,
    registeredOn: scenario === "new" ? addDays(TODAY, -(4 + i % 5)) : addDays(TODAY, -(200 + i * 9)),
    scenario,
    measurements,
  };
});

const MEALS = ["Khichdi with vegetables", "Dal, rice and seasonal sabzi", "Vegetable upma", "Roti with dal", "Poha with peanuts", "Sprouts chaat and banana"];
const SUPPS = ["Iron-folic acid syrup", "Take-home ration packet", "Vitamin A drops", "Micronutrient sprinkles", "None this visit"];
const APPETITE = ["Good", "Good", "Moderate", "Moderate", "Low"];
const OBS = ["Finished the full portion.", "Ate with enthusiasm, asked for more.", "Left some of the portion.", "Needed encouragement to eat.", "No concerns noted."];

// Nutrition records: "complete" children have a record in the last 7 days; others are stale/missing.
const incompleteIds = new Set(["5", "7", "11", "14", "17", "18", "20"]);
export const seedNutrition = seedChildren.flatMap((c, i) => {
  const count = incompleteIds.has(c.id) ? (c.id === "18" ? 0 : 1) : 3;
  return Array.from({ length: count }, (_, k) => {
    const stale = incompleteIds.has(c.id);
    const date = addDays(TODAY, -(stale ? 14 + i : (i % 3) + k * 4));
    return {
      id: `n${c.id}-${k}`, childId: c.id, date,
      meal: MEALS[(i + k) % MEALS.length], portion: ["Full", "Three-quarter", "Half"][(i + k) % 3],
      supplement: SUPPS[(i * 2 + k) % SUPPS.length],
      appetite: APPETITE[(i + k) % APPETITE.length],
      observation: OBS[(i + k * 2) % OBS.length],
    };
  });
}).sort((a, b) => b.date.localeCompare(a.date));

const mkF = (id, childId, reason, offset, priority, status = "pending", workerId = "w1", completedOn = null) =>
  ({ id: `f${id}`, childId, reason, due: addDays(TODAY, offset), priority, status, workerId, completedOn });

export const seedFollowups = [
  mkF(1, "1", "Weight trend needs review", 0, "High"),
  mkF(2, "3", "Monthly follow-up visit", 0, "Medium", "pending", "w3"),
  mkF(3, "5", "Overdue measurement; contact guardian", -6, "High"),
  mkF(4, "11", "Measurement follow-up recommended", -3, "High", "pending", "w3"),
  mkF(5, "7", "Growth trend requires review", -1, "Medium", "pending", "w3"),
  mkF(6, "14", "Review recent weight records", 1, "Medium"),
  mkF(7, "17", "Missed monthly measurement", -9, "High"),
  mkF(8, "13", "First follow-up after registration", 2, "Low"),
  mkF(9, "18", "Complete nutrition baseline", 3, "Low", "pending", "w3"),
  mkF(10, "10", "Routine monthly check-in", 5, "Low"),
  mkF(11, "8", "Routine monthly check-in", 6, "Low", "pending", "w4"),
  mkF(12, "20", "Nutrition record incomplete", 4, "Medium"),
  mkF(13, "2", "Monthly growth measurement recorded", -2, "Low", "completed", "w1", addDays(TODAY, -2)),
  mkF(14, "4", "Routine monthly check-in", -5, "Low", "completed", "w1", addDays(TODAY, -5)),
  mkF(15, "9", "Routine monthly check-in", -8, "Low", "completed", "w4", addDays(TODAY, -8)),
  mkF(16, "6", "Routine monthly check-in", -4, "Low", "completed", "w3", addDays(TODAY, -4)),
  mkF(17, "15", "Routine monthly check-in", -6, "Low", "completed", "w3", addDays(TODAY, -6)),
  mkF(18, "12", "Routine monthly check-in", -7, "Low", "completed", "w4", addDays(TODAY, -7)),
  mkF(19, "19", "Routine monthly check-in", -3, "Low", "completed", "w4", addDays(TODAY, -3)),
  mkF(20, "16", "Routine monthly check-in", -10, "Low", "completed", "w4", addDays(TODAY, -10)),
  mkF(21, "4", "Nutrition record review", -12, "Medium", "completed", "w1", addDays(TODAY, -11)),
];

export const seedNotifications = [
  { id: "nt1", type: "priority", title: "Priority review", body: "Aarav Kumar requires growth record review.", at: `${TODAY}T08:50`, read: false, to: "/children/1" },
  { id: "nt2", type: "followup", title: "Follow-up due", body: "Vivaan Sharma's follow-up is scheduled today.", at: `${TODAY}T08:00`, read: false, to: "/followups" },
  { id: "nt3", type: "reminder", title: "Reminder", body: "3 children are due for monthly measurements.", at: `${TODAY}T07:30`, read: false, to: "/growth" },
  { id: "nt4", type: "done", title: "Completed", body: "Ananya Singh's latest measurement was recorded.", at: `${addDays(TODAY, -1)}T15:20`, read: true, to: "/children/2" },
];

export const seedActivity = [
  { id: "a1", at: `${TODAY}T10:45`, text: "New child registered: Pari Tiwari", kind: "register", childId: "18" },
  { id: "a2", at: `${TODAY}T10:02`, text: "Follow-up completed for Vivaan Sharma", kind: "followup", childId: "3" },
  { id: "a3", at: `${TODAY}T09:15`, text: "Nutrition record added for Ananya Singh", kind: "nutrition", childId: "2" },
  { id: "a4", at: `${TODAY}T08:42`, text: "Priya recorded a measurement for Aarav Kumar", kind: "measurement", childId: "1" },
  { id: "a5", at: `${addDays(TODAY, -1)}T16:30`, text: "Meena scheduled a follow-up for Reyansh Meena", kind: "followup", childId: "7" },
];
