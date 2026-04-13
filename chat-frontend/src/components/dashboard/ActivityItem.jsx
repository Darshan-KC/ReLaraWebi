export default function ActivityItem({ text, time }) {
  return (
    <div className="flex justify-between text-sm text-gray-600 border-b py-2">
      <span>{text}</span>
      <span className="text-gray-400">{time}</span>
    </div>
  );
}