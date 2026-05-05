import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileForm from "../components/profile/ProfileForm";
import Card from "../components/ui/Card";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);

  const handleSave = async (data) => {
    await updateProfile(data);
    setEditing(false);
  };

  return (
    <div className="max-w-xl mx-auto">

      <Card>
        {!editing ? (
          <ProfileCard
            user={user}
            onEdit={() => setEditing(true)}
          />
        ) : (
          <ProfileForm
            user={user}
            onCancel={() => setEditing(false)}
            onSave={handleSave}
          />
        )}
      </Card>

    </div>
  );
}