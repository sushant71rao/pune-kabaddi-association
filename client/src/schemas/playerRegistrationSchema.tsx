import { z } from "zod";

export const playerRegistrationSchema = z.object({
    fullName: z
        .string({ required_error: "Full Name is required." })
        .min(5, "Full Name should be at least 5 characters"),
    birthDate: z.date({ required_error: "A date of birth is required." }),
    teamName: z
        .string({ required_error: "Team name is required." }),
    ageGroup: z
        .string({ required_error: "Age group is required." })
        .min(1, "Please select an age group"),
    address: z
        .string({ required_error: "Address is required." })
        .min(10, "Address should be at least 10 characters"),
    adharCard: z
        .string({ required_error: "Adhar Card is required." }),
    birthCertificate: z
        .string({ required_error: "Birth Certificate is required." }),
    achievements: z
        .string({ required_error: "Achievements is required." }),
    achievementDocument: z
        .string({ required_error: "Achievement Document is required." })
});
