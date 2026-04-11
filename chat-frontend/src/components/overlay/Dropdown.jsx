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

// import { useState, useRef, useEffect } from "react";

// export default function Dropdown({ trigger, children }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   // Close on outside click
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setOpen(false);
//       }
//     }

//     function handleEscape(e) {
//       if (e.key === "Escape") setOpen(false);
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscape);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   return (
//     <div className="relative inline-block" ref={ref}>
//       {/* Trigger */}
//       <div onClick={() => setOpen((prev) => !prev)}>
//         {trigger}
//       </div>

//       {/* Menu */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }