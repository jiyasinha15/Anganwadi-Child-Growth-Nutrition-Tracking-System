import { useEffect, useRef, useState } from "react";

export function Dropdown({ trigger, children, align = "right", label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (e.type === "keydown" ? e.key === "Escape" : !ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);
  return (
    <div className="dd" ref={ref}>
      <button className="dd-trigger" aria-haspopup="true" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)}>{trigger}</button>
      {open && <div className={`dd-menu dd-${align}`} onClick={(e) => e.target.closest("[data-close]") && setOpen(false)}>{children}</div>}
    </div>
  );
}
