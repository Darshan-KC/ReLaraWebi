export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}