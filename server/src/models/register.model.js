import mongoose, {Schema} from "mongoose";

const registerSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
    },
    password: {
        type: String,
        required: [true, "username is required"],
    },
})

export const Register = mongoose.model("Register", registerSchema)