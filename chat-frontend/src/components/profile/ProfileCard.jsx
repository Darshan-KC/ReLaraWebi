import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

export default function ProfileCard({ user, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 text-center">
      
      <Avatar name={user?.name} size="lg" />

      <h2 className="mt-4 text-xl font-semibold">
        {user?.name}
      </h2>

      <p className="text-gray-500">
        {user?.email}
      </p>
{/* This is for testing purposes only, to see if the profile card is working correctly. It should display the user's name and email, and have an edit button that triggers the onEdit function when clicked. */}
      <Button className="mt-4" onClick={onEdit}>
        Edit Profile
      </Button>
    </div>
  );
}