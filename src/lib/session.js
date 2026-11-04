import { useSyncExternalStore } from "react";
import { readJSON, writeJSON, removeKey } from "./storage";

// Demo-only session. There is no real authentication in this build.
const KEY = "angansetu.session";
const listeners = new Set();
let cache; // undefined = not read yet (read lazily, in the browser only)

function read() {
  if (cache === undefined) cache = readJSON(KEY, null) ?? readJSON(KEY, null, "session");
  return cache;
}
const emit = () => listeners.forEach((l) => l());

export function signIn(session, remember) {
  cache = session;
  writeJSON(KEY, session, remember ? "local" : "session");
  removeKey(KEY, remember ? "session" : "local");
  emit();
}
export function signOut() {
  cache = null;
  removeKey(KEY); removeKey(KEY, "session");
  emit();
}
export const useSession = () => useSyncExternalStore(
  (l) => { listeners.add(l); return () => listeners.delete(l); }, read, () => null);
