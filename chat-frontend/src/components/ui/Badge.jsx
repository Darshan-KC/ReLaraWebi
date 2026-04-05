export default function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${variants[variant]}`}>
      {children}
    </span>
  );
}