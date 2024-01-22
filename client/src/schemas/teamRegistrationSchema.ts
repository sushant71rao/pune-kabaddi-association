import { z } from "zod";

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

  logo: z.string({ required_error: "Team Logo is required." }),

  startingYear: z.date({ required_error: "Date is required" }),
  category: z.string({ required_error: "Category is required." }),
  ageGroup: z.string({ required_error: "Age Group is required." }),
  zone: z.string({ required_error: "Zone is required." }),

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
