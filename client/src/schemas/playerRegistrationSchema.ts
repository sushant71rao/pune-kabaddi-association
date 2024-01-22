import { z } from "zod";
import { achievementSchema } from "./achievemetSchema";

export const playerRegistrationSchema = z.object({

    firstName: z.string({ required_error: "First Name is required" }),
    middleName: z.string({ required_error: "Middle Name is required" }),
    lastName: z.string({ required_error: "Last Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNo: z.string().min(10, { message: "Invalid phone number." }),
    avatar: z.string({ required_error: "Profile image is required" }), // Assuming avatar is a URL or file path
    birthDate: z.date({ required_error: "Birth Date is required" }),
    gender: z.string().refine((value) => ["m", "f"].includes(value), {
        message: "Invalid gender.",
    }),
    teamName: z.string({ required_error: "Team Name is required." }),
    playingPosition: z.string({ required_error: "Playing Position is required." }),
    adharNumber: z.string().min(12, { message: "Invalid Aadhar number." }),
    adharCard: z.string({required_error: "Adhar card is required"}), // Assuming adharCard is a file path or base64 representation
    birthCertificate: z.string({required_error: "Birth certificate is required"}), // Assuming birthCertificate is a file path or base64 representation
    password: z.string().min(8, { message: "Password must be at least 5 characters." }),

    achievements: z.array(achievementSchema),
  
});
