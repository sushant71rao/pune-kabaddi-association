import { z } from "zod";

export const teamRegistrationSchema = z.object({
    fullName: z
        .string({ required_error: "Full Name is required." })
        .min(5, "Full Name should be at least 5 characters"),
    email: z
        .string({ required_error: "Email is required." })
        .min(5, "email should be at least 5 characters"),
    contactNumber: z
        .string({ required_error: "Phone Number is required." })
        .min(10, "phone number should be at least 10 characters"),
    alternateContactNumber: z
        .string()
        .min(10, "phone number should be at least 10 characters"),
    teamName: z
        .string({ required_error: "Team Name is required." })
        .min(2, "Team Name should be at least 2 characters"),
    teamLogo: z
        .string({ required_error: "Team Logo is required." }),

    teamPhoto: z
        .string({ required_error: "Team Photo is required." }),
    category: z
        .string({ required_error: "Category is required." }),
    ageGroup: z
        .string({ required_error: "Age group is required." }),

    adharCard: z
        .string({ required_error: "Adhar Card is required." })
        .min(1, "Adhar Card is required"),

    achievementDocument: z
        .string({ required_error: "Achievement Document is required." })
        .min(1, "Document of Biggest achievement is required"),
});
