import * as z from "zod"

const signInSchema = z.object({
    email: z.string({ required_error: "email is required." }).min(2, {
        message: "Username must be at least 4 characters.",
    }),
    password: z.string({ required_error: "password is required." }).min(2, {
        message: "Password must be at least 2 characters.",
    }),
})
export default signInSchema