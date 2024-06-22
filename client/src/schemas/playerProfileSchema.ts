import { z } from "zod";
import { achievementSchema } from "./achievemetSchema";
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const playerProfileSchema = z.object({
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

  birthDate: z.coerce.date(),
  gender: z.string().refine((value) => ["m", "f"].includes(value), {
    message: "Invalid gender.",
  }),
  teamName: z.string().min(1, { message: "Team Name is required." }),
  playingSkill: z.string().min(1, {
    message: "Playing Position is required.",
  }),
  adharNumber: z.string().min(12, { message: "Invalid Aadhar number." }),

  avatar: z
    .any()
    .nullable()
    .refine((files) => {
      if (!files?.length || typeof files == typeof "") {
        return true;
      }
      return files?.[0]?.size < MAX_FILE_SIZE;
    }, `Max file size is 5MB.`)
    .refine((files) => {
      if (!files?.length || typeof files == typeof "") {
        return true;
      }
      ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
    }, ".jpg, .jpeg, .png and .webp files are accepted."),
  adharCard: z
    .any()
    .nullable()
    .refine((files) => {
      //Condition to return true if no file exists or even for the string of image is found
      if (!files?.length || typeof files == typeof "") {
        return true;
      }
      return files?.[0]?.size < MAX_FILE_SIZE;
    }, `Max file size is 5MB.`)
    .refine((files) => {
      if (!files?.length || typeof files == typeof "") {
        return true;
      }
      console.log(files[0]?.type, "here");
      ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
    }, ".jpg, .jpeg, .png and .webp files are accepted."),
  birthCertificate: z
    .any()
    .nullable()
    .refine((files) => {
      //Condition to return true if no file exists or even for the string of image is found
      if (!files?.length || typeof files == typeof "") {
        return true;
      }
      return files?.[0]?.size < MAX_FILE_SIZE;
    }, `Max file size is 5MB.`)
    .refine((files) => {
      if (!files?.length || typeof files == typeof "") {
        return true;
      }
      ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
    }, ".jpg, .jpeg, .png and .webp files are accepted."),
  password: z
    .string()
    .min(8, { message: "Password must be at least 5 characters." }),

  achievements: z.array(achievementSchema),
});

export type PlayerType = z.infer<typeof playerProfileSchema>;
