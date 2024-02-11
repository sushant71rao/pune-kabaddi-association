import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const playerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: [2, 'First Name should be min 2 characters'],
    },
    middleName: {
        type: String,
        minlength: [2, 'Middle Name should be min 2 characters'],
    },
    lastName: {
        type: String,
        minlength: [2, 'Last Name should be min 2 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Invalid email address',
        },
    },
    phoneNo: {
        type: String,
        minlength: [10, 'Invalid phone number.'],
    },
    avatar: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: [true, 'Birth Date is required'],
    },
    gender: {
        type: String,
        validate: {
            validator: (value) => ['m', 'f'].includes(value),
            message: 'Invalid gender.',
        },
    },
    teamName: {
        type: String,
        minlength: [1, 'Team Name is required.'],
    },
    playingSkill: {
        type: String,
        minlength: [1, 'Playing Position is required.'],
    },
    adharNumber: {
        type: String,
        minlength: [12, 'Invalid Adhar number.'],
    },
    adharCard: {
        type: String,
    },
    birthCertificate: {
        type: String,
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters.'],
    },
    achievements: [
        {
            achievementYear: {
                type: String,
            },
            achievementTitle: {
                type: String,
            },
            achievementDocument: {
                type: String,

            },
        },
    ],
}, { timestamps: true });


playerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
})

playerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

playerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phoneNo: this.phoneNo,
            firstName: this.firstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

playerSchema.methods.generateRefreshToken = function () {
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

export const Player = mongoose.model('Player', playerSchema);


