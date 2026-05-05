import StatCard from "../components/dashboard/StatCard";
import ActivityItem from "../components/dashboard/ActivityItem";
import Card from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  // Fake data (replace with API later)
  const stats = [
    { title: "Messages", value: 120, icon: "💬" },
    { title: "Contacts", value: 45, icon: "👥" },
    { title: "Online Users", value: 8, icon: "🟢" },
  ];

  const activities = [
    { text: "You sent a message", time: "2 min ago" },
    { text: "New user joined", time: "10 min ago" },
    { text: "Profile updated", time: "1 hour ago" },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold">
          Welcome back, {user?.name} 👋
        </h2>
        <p className="text-gray-500">
          Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Activity Section */}
      <Card>
        <h3 className="font-semibold mb-4">
          Recent Activity
        </h3>

        <div>
          {activities.map((item, index) => (
            <ActivityItem key={index} {...item} />
          ))}
        </div>
      </Card>

    </div>
  );
}