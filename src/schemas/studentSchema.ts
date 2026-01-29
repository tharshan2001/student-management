import { z } from "zod";

export const studentSchema = z.object({
  firstName: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[A-Za-z]+$/, "Alphabets only"),
  middleName: z
    .string()
    .regex(/^[A-Za-z]*$/, "Alphabets only")
    .optional(),
  lastName: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[A-Za-z]+$/, "Alphabets only"),
  birthDate: z
    .string()
    .refine((val) => new Date(val) < new Date(), "Birth date must be in the past"),
  address: z.object({
    line1: z.string().min(5),
    line2: z.string().optional(),
    city: z.string().min(2).regex(/^[A-Za-z]+$/, "Alphabets only"),
    district: z.string(),
  }),
  contactNumber: z.string().length(10).regex(/^\d+$/, "Must be 10 digits"),
  email: z.string().email().optional(),
});
