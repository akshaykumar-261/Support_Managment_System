import { z } from "zod";
export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    
  phoneNo: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role_Id: z.number(),
})