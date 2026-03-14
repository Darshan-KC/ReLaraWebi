import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await AuthService.register(formData);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">

        <h1 className="text-4xl font-bold mb-6">Register</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Register
        </button>

      </form>

    </div>
  );
}