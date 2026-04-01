import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/authSchema";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate("/");
    } catch (error) {
      // 🔥 Laravel Validation Errors (422)
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;

        Object.keys(backendErrors).forEach((field) => {
          setError(field, {
            type: "server",
            message: backendErrors[field][0],
          });
        });
      } 
      // 🔥 Other Errors
      else {
        setError("root", {
          type: "server",
          message: "Something went wrong",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account 🚀
        </h2>

        {errors.root && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.root.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              {...register("password_confirmation")}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm password"
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}