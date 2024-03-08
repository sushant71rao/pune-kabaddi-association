import mongoose from "mongoose";
import bcrypt from "bcrypt";

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    logo: {
      type: String, // Assuming you save the file path or URL
      required: true,
    },
    startingYear: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["m", "f"], // Assuming 'm' for Male and 'f' for Female
      required: true,
    },
    ageGroup: {
      type: String,
      enum: ["subJunior", "junior", "open"],
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    authorizedPersonName: {
      type: String,
      required: true,
    },
    authorizedPersonPhoneNo: {
      type: String,
      required: true,
    },
    managerName: {
      type: String,
      required: true,
    },
    managerPhoneNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

teamSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

teamSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      phoneNo: this.phoneNo,
      teamName: this.teamName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

teamSchema.methods.generateRefreshToken = function () {
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

export const Team = mongoose.model("Team", teamSchema);
