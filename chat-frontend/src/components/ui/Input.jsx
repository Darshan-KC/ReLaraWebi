export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm mb-1 text-gray-600">
          {label}
        </label>
      )}

      <input
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 
        ${error ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-500"}
        ${className}`}
        {...props}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}