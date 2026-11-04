// Single source of truth. State is hydrated lazily on first access in the browser, never at
// module load, so importing this file during SSR cannot touch localStorage.
import { useSyncExternalStore } from "react";
import { seedChildren, seedNutrition, seedFollowups, seedNotifications, seedActivity } from "../data/seed";
import { readJSON, writeJSON } from "../lib/storage";

const KEY = "angansetu.demo.v1";
const initial = () => ({
  children: seedChildren, nutrition: seedNutrition, followups: seedFollowups,
  notifications: seedNotifications, activity: seedActivity,
});

let state = null;
const listeners = new Set();
const typeofWindow = () => typeof window !== "undefined";

export function getState() {
  if (state) return state;
  const saved = typeofWindow() ? readJSON(KEY) : null;
  const valid = saved && Array.isArray(saved.children) && Array.isArray(saved.followups) && Array.isArray(saved.nutrition);
  state = valid ? { ...initial(), ...saved } : initial();
  return state;
}
const emit = () => listeners.forEach((l) => l());
export function update(fn) {
  state = fn(getState());
  writeJSON(KEY, state);
  emit();
}
export function resetDemoData() {
  state = initial();
  writeJSON(KEY, state);
  emit();
}
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
export const useStore = () => useSyncExternalStore(subscribe, getState, getState);

let seq = 0;
export const uid = (p) => `${p}${Date.now().toString(36)}${(seq++).toString(36)}`;
