import { z } from "zod";
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export const officialProfileSchema = z.object({
    firstName: z.string({ required_error: "First Name is required" }),
    middleName: z.string({ required_error: "Middle Name is required" }),
    lastName: z.string({ required_error: "Last Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNo: z.string().min(10, { message: "Invalid phone number." }),
    avatar: z
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
    birthDate: z.date({ required_error: "Birth Date is required" }),
    gender: z.string().refine((value) => ["m", "f"].includes(value), {
        message: "Invalid gender.",
    }),
    passingYear: z
        .string({ required_error: "Passing year is required" })
        .min(4, { message: "Enter valid year" }),
    adharNumber: z.string().min(12, { message: "Invalid Aadhar number." }),
    passingCertificate: z
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
            ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
        }, ".jpg, .jpeg, .png and .webp files are accepted."),

});

export type OfficialType = z.infer<typeof officialProfileSchema>