import { z } from "zod";
import { achievementSchema } from "./achievemetSchema";
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const playerRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First Name should be min 2 characters" }),
  middleName: z
    .string()
    .min(2, { message: "Middle Name should be min 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last Name should be min 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNo: z.string().min(10, { message: "Invalid phone number." }),
  avatar: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  birthDate: z.date({ required_error: "Birth Date is required" }),
  gender: z.string().refine((value) => ["m", "f"].includes(value), {
    message: "Invalid gender.",
  }),
  teamName: z.string().min(1, { message: "Team Name is required." }),
  playingSkill: z.string(),
  adharNumber: z.string().min(12, { message: "Invalid Aadhar number." }),
  adharCard: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  birthCertificate: z.any(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 5 characters." }),

  achievements: z.array(achievementSchema),
});