import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const {Login} = useAuth();
  // const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    Login(form);
    // navigate("/chat");
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Login Page</h1>
      <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}