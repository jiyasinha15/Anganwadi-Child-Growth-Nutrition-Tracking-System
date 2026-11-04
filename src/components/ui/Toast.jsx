import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

const ToastCtx = createContext(null);
const ICONS = { success: CheckCircle2, warning: AlertTriangle, error: XCircle, info: Info };
let seq = 0;

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const dismiss = useCallback((id) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const push = useCallback((type, message, detail) => {
    const id = ++seq;
    setItems((l) => [...l.slice(-3), { id, type, message, detail }]);
    setTimeout(() => dismiss(id), type === "error" ? 7000 : 4200);
  }, [dismiss]);
  const api = useMemo(() => ({
    success: (m, d) => push("success", m, d), warning: (m, d) => push("warning", m, d),
    error: (m, d) => push("error", m, d), info: (m, d) => push("info", m, d),
  }), [push]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toast-region" role="region" aria-label="Notifications" aria-live="polite">
        {items.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div key={t.id} className={`toast toast-${t.type}`} role={t.type === "error" ? "alert" : "status"}>
              <Icon size={18} aria-hidden="true" />
              <div className="toast-body"><strong>{t.message}</strong>{t.detail && <span>{t.detail}</span>}</div>
              <button className="icon-btn sm" onClick={() => dismiss(t.id)} aria-label="Dismiss notification"><X size={14} /></button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
