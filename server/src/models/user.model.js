import mongoose, { Schema } from 'mongoose'
// import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = Schema({
    // userName: {
    //     type: String,
    //     required: [true, "Username is required"],
    //     unique: [true, "This username is already registered"],
    //     trim: true
    // },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "This email is already registered"],
        trim: true
    },
    fullName: {
        type: String,

        trim: true
    },
    phoneNo: {
        type: String,
        required: [true, "phone number Name is required"],
        index: true
    },
    avatar: {
        type: String,
        required: [true, "avatar Name is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
}
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phoneNo: this.phoneNo,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userSchema)