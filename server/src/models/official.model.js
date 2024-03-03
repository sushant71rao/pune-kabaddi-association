import mongoose from "mongoose";
import bcrypt from "bcrypt";

const officialSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    middleName: {
      type: String,
      required: [true, "Middle Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    email: {
      type: String,
      validate: {
        validator: (value) => /\S+@\S+\.\S+/.test(value),
        message: "Invalid email address",
      },
      unique: true,
    },
    phoneNo: {
      type: String,
      validate: {
        validator: (value) => /\d{10}/.test(value),
        message: "Invalid phone number.",
      },
    },
    avatar: {
      type: String,
      required: [true, "Image is requiered"],
    },
    birthDate: {
      type: Date,
      required: [true, "Birth Date is required"],
    },
    gender: {
      type: String,
      validate: {
        validator: (value) => ["m", "f"].includes(value),
        message: "Invalid gender.",
      },
    },
    passingYear: {
      type: String,
      validate: {
        validator: (value) => /\d{4}/.test(value),
        message: "Enter valid year",
      },
      required: [true, "Passing year is required"],
    },
    adharNumber: {
      type: String,
      validate: {
        validator: (value) => /\d{12}/.test(value),
        message: "Invalid Aadhar number.",
      },
    },
    passingCertificate: {
      type: String,
      required: [true, "Image is requiered"],
    },
    adharCard: {
      type: String,
      required: [true, "Image is requiered"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters."],
    },
  },
  { timestamps: true }
);

export const Official = mongoose.model("Official", officialSchema);

officialSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

officialSchema.method("isPasswordCorrect", async (password) => {
  return await bcrypt.compare(this.password, password);
});

officialSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      phoneNo: this.phoneNo,
      firstName: this.firstName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

officialSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
