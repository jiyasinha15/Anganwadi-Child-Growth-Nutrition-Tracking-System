import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Modal } from "../ui";
import { MeasurementForm, NutritionForm, FollowupForm } from "./forms";

const Ctx = createContext(null);
const TITLES = {
  measurement: ["Record measurement", "Height and weight update the child's growth journey."],
  nutrition: ["Add nutrition record", "Meals, participation and dietary notes."],
  followup: ["Create follow-up", "A reminder to review or revisit a child."],
  editFollowup: ["Edit follow-up", "Change the reason, due date or priority."],
};

// One place that owns the record/create dialogs, so any screen can open them with open("measurement", { childId }).
export function ActionProvider({ children }) {
  const [act, setAct] = useState(null);
  const close = useCallback(() => setAct(null), []);
  const open = useCallback((kind, opts = {}) => setAct({ kind, ...opts }), []);
  const api = useMemo(() => ({ open, close }), [open, close]);
  const done = (c) => { act?.onDone?.(c); close(); };
  const [title, desc] = TITLES[act?.kind] ?? ["", ""];
  return (
    <Ctx.Provider value={api}>
      {children}
      <Modal open={!!act} onClose={close} title={title} description={desc} size="md">
        {act?.kind === "measurement" && <MeasurementForm childId={act.childId} onDone={done} onCancel={close} />}
        {act?.kind === "nutrition" && <NutritionForm childId={act.childId} onDone={done} onCancel={close} />}
        {act?.kind === "followup" && <FollowupForm childId={act.childId} onDone={done} onCancel={close} />}
        {act?.kind === "editFollowup" && <FollowupForm followup={act.followup} onDone={done} onCancel={close} />}
      </Modal>
    </Ctx.Provider>
  );
}
export const useActions = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useActions must be used inside ActionProvider");
  return ctx;
};
