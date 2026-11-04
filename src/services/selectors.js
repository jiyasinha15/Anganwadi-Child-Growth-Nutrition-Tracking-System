import { useMemo } from "react";
import { useStore } from "./store";
import { useSession } from "../lib/session";
import { scopeState } from "./analyticsService";
import { centres } from "../data/seed";

// Worker screens read through this hook so every page sees the same centre-scoped slice of the store.
export function useWorkerScope() {
  const state = useStore();
  const session = useSession();
  const centreId = session?.centreId ?? "c1";
  const scoped = useMemo(() => scopeState(state, centreId), [state, centreId]);
  const centre = centres.find((c) => c.id === centreId) ?? centres[0];
  return { state: scoped, full: state, centre, session };
}
