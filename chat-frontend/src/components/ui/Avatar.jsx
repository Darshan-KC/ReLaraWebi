export default function Avatar({ src, name, size = "md" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return src ? (
    <img
      src={src}
      className={`rounded-full object-cover ${sizes[size]}`}
    />
  ) : (
    <div
      className={`bg-gray-300 rounded-full flex items-center justify-center ${sizes[size]}`}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}