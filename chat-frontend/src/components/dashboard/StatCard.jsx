export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center justify-between">
      
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>

      <div className="text-2xl">
        {icon}
      </div>

    </div>
  );
}