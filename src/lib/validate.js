import { TODAY, parse } from "./dates";

// Plausible ranges for children aged 0-6. These catch typing mistakes; they are not clinical limits.
export const RANGES = { height: [40, 140], weight: [2, 40] };

export function validateMeasurement({ date, height, weight }, dob) {
  const e = {};
  if (!date) e.date = "Choose the measurement date.";
  else if (Number.isNaN(parse(date).getTime())) e.date = "Enter a valid date.";
  else if (date > TODAY) e.date = "The date can't be in the future.";
  else if (dob && date < dob) e.date = "The date can't be before the child's date of birth.";

  const num = (key, label, unit) => {
    const raw = String(key === "height" ? height : weight).trim();
    const v = Number(raw);
    const [min, max] = RANGES[key];
    if (!raw) e[key] = `Enter ${label}.`;
    else if (!Number.isFinite(v)) e[key] = `${label[0].toUpperCase()}${label.slice(1)} must be a number.`;
    else if (v < min || v > max) e[key] = `Enter a value between ${min} and ${max} ${unit}. Check for typing mistakes.`;
  };
  num("height", "height", "cm");
  num("weight", "weight", "kg");
  return e;
}

export function validateRegistration(f) {
  const e = {};
  if (!f.name.trim()) e.name = "Enter the child's name.";
  if (!f.dob) e.dob = "Enter the date of birth.";
  else if (f.dob > TODAY) e.dob = "Date of birth can't be in the future.";
  if (!f.gender) e.gender = "Select a gender.";
  if (!f.guardian.trim()) e.guardian = "Enter the guardian's name.";
  if (!/^\d{10}$/.test(f.phone.replace(/\s/g, ""))) e.phone = "Enter a 10-digit phone number.";
  if (!f.centreId) e.centreId = "Select a centre.";
  return e;
}

export function validateFollowup(f) {
  const e = {};
  if (!f.childId) e.childId = "Select a child.";
  if (!f.reason.trim()) e.reason = "Describe the reason for this follow-up.";
  if (!f.due) e.due = "Choose a due date.";
  return e;
}

export function validateNutrition(f) {
  const e = {};
  if (!f.childId) e.childId = "Select a child.";
  if (!f.date) e.date = "Choose the date.";
  else if (f.date > TODAY) e.date = "The date can't be in the future.";
  if (!f.meal.trim()) e.meal = "Enter the meal or food served.";
  return e;
}
