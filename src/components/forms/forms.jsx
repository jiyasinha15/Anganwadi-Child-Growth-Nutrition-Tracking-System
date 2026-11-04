import { useMemo, useState } from "react";
import { useToast, Field, SubmitButton } from "../ui";
import { useWorkerScope } from "../../services/selectors";
import { getChild, addMeasurement, registerChild } from "../../services/childrenService";
import { logNutrition } from "../../services/nutritionService";
import { scheduleFollowup, updateFollowup } from "../../services/followupService";
import { calculateBMI } from "../../services/growthService";
import { validateMeasurement, validateNutrition, validateFollowup, validateRegistration, RANGES } from "../../lib/validate";
import { TODAY, addDays, ageLabel } from "../../lib/dates";
import { centres } from "../../data/seed";

// Small shared hook: field state, errors, and a short "saving" state so buttons show progress.
function useForm(initial, validate) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => { setValues((v) => ({ ...v, [k]: e.target.value })); if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined })); };
  const submit = (commit) => (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) { setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 0); return; }
    setSaving(true);
    setTimeout(() => { commit(values); setSaving(false); }, 250);
  };
  return { values, errors, saving, set, submit, setValues };
}

function ChildSelect({ value, onChange, error, locked }) {
  const { state } = useWorkerScope();
  const sorted = useMemo(() => [...state.children].sort((a, b) => a.name.localeCompare(b.name)), [state.children]);
  return (
    <Field label="Child" required error={error} hint={locked ? undefined : "Choose the child this record belongs to."}>
      <select className="input" value={value} onChange={onChange} disabled={locked}>
        <option value="">Select a child</option>
        {sorted.map((c) => <option key={c.id} value={c.id}>{c.name} ({ageLabel(c.dob)})</option>)}
      </select>
    </Field>
  );
}

export function MeasurementForm({ childId = "", onDone, onCancel }) {
  const toast = useToast();
  const [picked, setPicked] = useState(childId);
  const child = picked ? getChild(picked) : null;
  const f = useForm({ date: TODAY, height: "", weight: "", notes: "" }, (v) => ({
    ...(picked ? {} : { childId: "Select a child." }), ...validateMeasurement(v, child?.dob) }));
  const bmi = calculateBMI(f.values.weight, f.values.height);
  const last = child?.measurements.at(-1);
  const go = f.submit((v) => {
    const r = addMeasurement(picked, v);
    toast.success("Measurement recorded", `${child.name}: ${r.height} cm, ${r.weight} kg${r.bmi ? `, BMI ${r.bmi}` : ""}`);
    onDone?.(child);
  });
  return (
    <form onSubmit={go} noValidate className="form-stack">
      <ChildSelect value={picked} onChange={(e) => setPicked(e.target.value)} locked={!!childId} error={!picked && f.errors.childId} />
      {last && <p className="form-context">Last measurement: {last.height} cm, {last.weight} kg on {last.date}.</p>}
      <div className="form-grid">
        <Field label="Measurement date" required error={f.errors.date}><input className="input" type="date" max={TODAY} value={f.values.date} onChange={f.set("date")} /></Field>
        <span />
        <Field label="Height (cm)" required error={f.errors.height} hint={`Typical entries are ${RANGES.height[0]}–${RANGES.height[1]} cm.`}>
          <input className="input" type="number" inputMode="decimal" step="0.1" value={f.values.height} onChange={f.set("height")} placeholder="e.g. 96.5" /></Field>
        <Field label="Weight (kg)" required error={f.errors.weight} hint={`Typical entries are ${RANGES.weight[0]}–${RANGES.weight[1]} kg.`}>
          <input className="input" type="number" inputMode="decimal" step="0.1" value={f.values.weight} onChange={f.set("weight")} placeholder="e.g. 14.2" /></Field>
        <Field label="Notes (optional)" full><textarea className="input" value={f.values.notes} onChange={f.set("notes")} placeholder="Anything worth remembering about this visit" maxLength={240} /></Field>
      </div>
      <div className="calc"><span>Calculated BMI</span><b>{bmi ?? "—"}</b><small>For record keeping. BMI for children should be read against age- and sex-specific references by a health professional.</small></div>
      <div className="form-actions">{onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}<SubmitButton saving={f.saving}>Save measurement</SubmitButton></div>
    </form>
  );
}

const PORTIONS = ["Full", "Three-quarter", "Half", "Quarter"];
const APPETITE = ["Good", "Moderate", "Low"];
export function NutritionForm({ childId = "", onDone, onCancel }) {
  const toast = useToast();
  const f = useForm({ childId, date: TODAY, meal: "", portion: "Full", appetite: "Good", supplement: "", observation: "" }, validateNutrition);
  const go = f.submit((v) => {
    const { childId: id, ...rec } = v;
    logNutrition(id, { ...rec, supplement: rec.supplement.trim() || "None this visit", observation: rec.observation.trim() || "No concerns noted." });
    toast.success("Nutrition record saved", getChild(id).name);
    onDone?.(getChild(id));
  });
  return (
    <form onSubmit={go} noValidate className="form-stack">
      <ChildSelect value={f.values.childId} onChange={f.set("childId")} locked={!!childId} error={f.errors.childId} />
      <div className="form-grid">
        <Field label="Date" required error={f.errors.date}><input className="input" type="date" max={TODAY} value={f.values.date} onChange={f.set("date")} /></Field>
        <Field label="Meal / food served" required error={f.errors.meal}><input className="input" value={f.values.meal} onChange={f.set("meal")} placeholder="e.g. Khichdi with vegetables" /></Field>
        <Field label="Meal participation"><select className="input" value={f.values.portion} onChange={f.set("portion")}>{PORTIONS.map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Appetite"><select className="input" value={f.values.appetite} onChange={f.set("appetite")}>{APPETITE.map((p) => <option key={p}>{p}</option>)}</select></Field>
        <Field label="Supplement given" hint="Leave blank if none this visit."><input className="input" value={f.values.supplement} onChange={f.set("supplement")} placeholder="e.g. Iron-folic acid syrup" /></Field>
        <Field label="Dietary notes" full><textarea className="input" value={f.values.observation} onChange={f.set("observation")} placeholder="Observations about eating, preferences or concerns" maxLength={240} /></Field>
      </div>
      <div className="form-actions">{onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}<SubmitButton saving={f.saving}>Save nutrition record</SubmitButton></div>
    </form>
  );
}

export function FollowupForm({ childId = "", followup, onDone, onCancel }) {
  const toast = useToast();
  const editing = !!followup;
  const f = useForm({ childId: followup?.childId ?? childId, reason: followup?.reason ?? "", due: followup?.due ?? addDays(TODAY, 7), priority: followup?.priority ?? "Medium" }, validateFollowup);
  const go = f.submit((v) => {
    if (editing) { updateFollowup(followup.id, v); toast.success("Follow-up updated"); }
    else { scheduleFollowup(v.childId, v); toast.success("Follow-up created", `${getChild(v.childId).name} · due ${v.due}`); }
    onDone?.(getChild(v.childId));
  });
  return (
    <form onSubmit={go} noValidate className="form-stack">
      <ChildSelect value={f.values.childId} onChange={f.set("childId")} locked={!!childId || editing} error={f.errors.childId} />
      <div className="form-grid">
        <Field label="Reason" required full error={f.errors.reason} hint="Use plain operational wording, e.g. “Nutrition follow-up” or “Re-measure next visit”.">
          <input className="input" value={f.values.reason} onChange={f.set("reason")} maxLength={120} /></Field>
        <Field label="Due date" required error={f.errors.due}><input className="input" type="date" value={f.values.due} onChange={f.set("due")} /></Field>
        <Field label="Priority"><select className="input" value={f.values.priority} onChange={f.set("priority")}>{["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}</select></Field>
      </div>
      <div className="form-actions">{onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}<SubmitButton saving={f.saving}>{editing ? "Save changes" : "Create follow-up"}</SubmitButton></div>
    </form>
  );
}

export function RegisterForm({ onDone, onCancel }) {
  const toast = useToast();
  const { centre } = useWorkerScope();
  const f = useForm({ name: "", dob: "", gender: "", guardian: "", phone: "", centreId: centre.id, address: "", date: TODAY, height: "", weight: "" },
    (v) => ({ ...validateRegistration(v), ...((v.height || v.weight) ? validateMeasurement(v, v.dob) : {}) }));
  const bmi = calculateBMI(f.values.weight, f.values.height);
  const go = f.submit((v) => {
    const c = registerChild(v);
    toast.success("Child registered", `${c.name} is now enrolled at ${c.center}.`);
    onDone?.(c);
  });
  return (
    <form onSubmit={go} noValidate className="form-stack">
      <section className="card">
        <div className="card-head"><div><h2>Child details</h2><p>Basic information used across records and reports.</p></div></div>
        <div className="form-grid">
          <Field label="Child's name" required error={f.errors.name}><input className="input" value={f.values.name} onChange={f.set("name")} autoComplete="off" /></Field>
          <Field label="Date of birth" required error={f.errors.dob}><input className="input" type="date" max={TODAY} value={f.values.dob} onChange={f.set("dob")} /></Field>
          <Field label="Gender" required error={f.errors.gender}><select className="input" value={f.values.gender} onChange={f.set("gender")}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></Field>
          <Field label="Anganwadi centre" required error={f.errors.centreId}><select className="input" value={f.values.centreId} onChange={f.set("centreId")}>{centres.filter((c) => c.status === "Active").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Guardian's name" required error={f.errors.guardian}><input className="input" value={f.values.guardian} onChange={f.set("guardian")} /></Field>
          <Field label="Phone number" required error={f.errors.phone} hint="10 digits, no country code."><input className="input" type="tel" inputMode="numeric" value={f.values.phone} onChange={f.set("phone")} /></Field>
          <Field label="Address (optional)" full hint="Defaults to the centre's location."><input className="input" value={f.values.address} onChange={f.set("address")} /></Field>
        </div>
      </section>
      <section className="card">
        <div className="card-head"><div><h2>First measurement (optional)</h2><p>Add it now, or record it at the first visit.</p></div></div>
        <div className="form-grid">
          <Field label="Measurement date" error={f.errors.date}><input className="input" type="date" max={TODAY} value={f.values.date} onChange={f.set("date")} /></Field>
          <span />
          <Field label="Height (cm)" error={f.errors.height}><input className="input" type="number" inputMode="decimal" step="0.1" value={f.values.height} onChange={f.set("height")} /></Field>
          <Field label="Weight (kg)" error={f.errors.weight}><input className="input" type="number" inputMode="decimal" step="0.1" value={f.values.weight} onChange={f.set("weight")} /></Field>
        </div>
        {bmi && <div className="calc"><span>Calculated BMI</span><b>{bmi}</b></div>}
      </section>
      <div className="form-actions"><button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button><SubmitButton saving={f.saving}>Register child</SubmitButton></div>
    </form>
  );
}
