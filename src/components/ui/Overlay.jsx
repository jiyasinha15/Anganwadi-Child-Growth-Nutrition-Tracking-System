import { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Shared behaviour: Esc to close, focus trap, scroll lock, focus restore.
function Overlay({ open, onClose, variant, title, description, children, footer, size = "md", className = "" }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    (node.querySelector("[data-autofocus]") || node.querySelector(FOCUSABLE))?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if (e.key !== "Tab") return;
      const els = [...node.querySelectorAll(FOCUSABLE)];
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; prev?.focus?.(); };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`${variant} ${variant}-${size} ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="overlay-head">
          <div><h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        <div className="overlay-body">{children}</div>
        {footer && <footer className="overlay-foot">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}

export const Modal = (p) => <Overlay {...p} variant="modal" />;
export const Drawer = (p) => <Overlay {...p} variant="drawer" />;

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", tone = "primary", children }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className={`btn btn-${tone}`} data-autofocus onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
      </>}>
      {message && <p className="muted">{message}</p>}
      {children}
    </Modal>
  );
}
