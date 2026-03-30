// src/validations/authSchema.js
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),

    email: z.string().min(1, "Email is required").email("Invalid email"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
