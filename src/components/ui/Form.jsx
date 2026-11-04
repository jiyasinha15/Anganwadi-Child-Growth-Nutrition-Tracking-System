import { Children, cloneElement, isValidElement, useId } from "react";
import { Loader2 } from "lucide-react";

// Wires label, hint and error to the single input child for screen readers.
export function Field({ label, required, hint, error, full, children }) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const child = Children.only(children);
  const input = isValidElement(child)
    ? cloneElement(child, { id, "aria-invalid": error ? "true" : undefined, "aria-describedby": describedBy, "aria-required": required || undefined })
    : child;
  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label htmlFor={id}>{label}{required && <span className="req" aria-hidden="true"> *</span>}{required && <span className="sr-only"> (required)</span>}</label>
      {input}
      {hint && !error && <small className="field-hint" id={`${id}-hint`}>{hint}</small>}
      {error && <small className="field-error" id={`${id}-err`} role="alert">{error}</small>}
    </div>
  );
}

export function SubmitButton({ saving, children, disabled }) {
  return (
    <button type="submit" className="btn btn-primary" disabled={saving || disabled} aria-busy={saving || undefined}>
      {saving && <Loader2 size={16} className="spin" aria-hidden="true" />}{children}
    </button>
  );
}

// Segmented control for small sets of mutually exclusive options (filters, chart metrics).
export function Segmented({ label, options, value, onChange }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        return <button key={opt.value} type="button" className={value === opt.value ? "on" : ""} aria-pressed={value === opt.value} onClick={() => onChange(opt.value)}>
          {opt.label}{opt.count != null && <em>{opt.count}</em>}</button>;
      })}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, label = "Search" }) {
  return (
    <div className="search-input">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <input type="search" className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={label} />
    </div>
  );
}
