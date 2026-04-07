import { useState } from "react";

export default function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 bg-white shadow rounded-lg p-2 z-50">
          {children}
        </div>
      )}
    </div>
  );
}