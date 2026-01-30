import { z } from "zod";

export const studentSchema = z.object({
  firstName: z
    .string()
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name cannot exceed 50 characters")
    .regex(/^[A-Za-z]+$/, "First Name can contain only letters"),
  
  middleName: z
    .string()
    .regex(/^[A-Za-z]*$/, "Middle Name can contain only letters")
    .optional(),

  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 characters")
    .max(50, "Last Name cannot exceed 50 characters")
    .regex(/^[A-Za-z]+$/, "Last Name can contain only letters"),

  birthDate: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return date < new Date();
    }, "Birth date must be in the past"),

  address: z.object({
    line1: z.string().min(5, "Address Line 1 must be at least 5 characters"),
    line2: z.string().optional(),
    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .regex(/^[A-Za-z\s]+$/, "City can contain only letters"),
    district: z.string().min(2, "District is required"),
  }),

  contactNumber: z
    .string()
    .length(10, "Contact Number must be exactly 10 digits")
    .regex(/^\d+$/, "Contact Number must contain only digits"),

  email: z.string().email("Invalid email address").optional(),
});
