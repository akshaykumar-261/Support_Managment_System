import { z } from "zod";
export const registerSchema = z.object({
  name: z
    .string()
    .min(4, "Name is required")
    .max(30, "Only 30 characters allowed"),
  email: z.string().min(1, "Email is required").email("Enter valid Email"),
  address: z.string().min(1, "Address is required"),
  phoneNo: z.string().min(10, "Phone must be 10 digits required"),
  password: z
    .string()
    .min(1, "Password must be at least 6")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number and special character",
    ),
  profile_Img: z.any(),
});
