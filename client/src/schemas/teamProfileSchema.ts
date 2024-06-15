import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export const teamProfileSchema = z.object({
    teamName: z
        .string({ required_error: "Team Name is required." })
        .min(2, "Team Name should be at least 2 characters"),
    email: z
        .string({ required_error: "Email is required." })
        .min(5, "email should be at least 5 characters"),
    phoneNo: z
        .string({ required_error: "Phone Number is required." })
        .min(10, "phone number should be at least 10 characters"),


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



    description: z.string(),

    logo: z
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


});

export type TeamType = z.infer<typeof teamProfileSchema>;