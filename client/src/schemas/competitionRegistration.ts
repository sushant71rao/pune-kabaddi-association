import { z } from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const competitionSchema = z.object({
  title: z.string({ required_error: "Title is required." }),
  description: z.string({ required_error: "Description is required." }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date.",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date.",
  }),
  location: z.string({ required_error: "Location is required." }),
  organizer: z.string({ required_error: "Organizer is required." }),
  organiserContact: z
    .string()
    .min(10, { message: "Invalid contact number." })
    .max(15, { message: "Contact number is too long." }),
  zone: z.string({ required_error: "Zone is required." }),
  ageGroup: z
    .array(z.enum(["subJunior", "junior", "open"]))
    .min(1, { message: "At least one age group must be selected." }),
  posterImage: z
    .any()
    .refine((files) => files?.length === 1, "Poster image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});
