import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export default function ProfileForm({ user, onChange, onSave }) {

  const { register, handleSubmit, setError, formState: { errors, isSubmitting }} = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await onSave(data);
    }catch(error){
      if(error.response?.status === 422){
        const backendErrors = error.response.data.errors;

        Object.keys(backendErrors).forEach((field) => {
          setError(field, { type: "server", message: backendErrors[field][0] });
        });
      }
    }
  };

  return (
    <form className="bg-white rounded-2xl shadow p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={user?.name || ""}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          error={errors.name?.message}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={user?.email || ""}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          error={errors.email?.message}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        loading={isSubmitting}
      >
        Save Changes
      </button>
    </form>
  );
}