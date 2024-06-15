import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const teamRegistrationSchema = z.object({
  teamName: z
    .string({ required_error: "Team Name is required." })
    .min(2, "Team Name should be at least 2 characters"),
  email: z
    .string({ required_error: "Email is required." })
    .min(5, "email should be at least 5 characters"),
  phoneNo: z
    .string({ required_error: "Phone Number is required." })
    .min(10, "phone number should be at least 10 characters"),

  logo: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (file) => file?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),

  startingYear: z.string()?.min(1, { message: "Please provide a value" }),
  category: z.string()?.min(1, { message: "Category is required." }),
  ageGroup: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one Age Group.",
  }),
  address: z.string()?.min(10, { message: "Minimum 10 characters required" }),
  pinCode: z.string()?.min(1, { message: "Please provide a value" }),

  authorizedPersonName: z
    .string({ required_error: "Team Name is required." })
    .min(2, "Team Name should be at least 2 characters"),

  authorizedPersonPhoneNo: z
    .string({ required_error: "Phone Number is required." })
    .min(10, "phone number should be at least 10 characters"),

  managerName: z
    .string({ required_error: "Team Name is required." })
    .min(2, "Team Name should be at least 2 characters"),

  managerPhoneNo: z
    .string({ required_error: "Phone Number is required." })
    .min(10, "phone number should be at least 10 characters"),

  password: z
    .string()
    .min(8, { message: "Password must be at least 5 characters." }),

  description: z.string(),
});

