import { Official } from "../models/official.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import LoginUtil from "../utils/LoginUtil.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileToS3 } from "../utils/s3Operations.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerOfficial = asyncHandler(async (req, res) => {
  res.setHeader("contentType", "application/json");
  const {
    firstName,
    middleName,
    lastName,
    email,
    phoneNo,
    passingYear,
    gender,
    adharNumber,
    password,
    birthDate,
  } = req.body;

  if (
    [
      firstName,
      middleName,
      lastName,
      email,
      phoneNo,
      passingYear,
      gender,
      adharNumber,
      password,
    ].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedOfficial = await Official.findOne({ email });

  if (existedOfficial) {
    throw new ApiError(409, "Official with email Id already exists");
  }

  const avatarLocalPath = req.files?.avatar[0];
  const adharCardLocalPath = req.files?.adharCard[0];
  const passingCertificateLocalPath = req.files?.passingCertificate[0];

  if (!avatarLocalPath || !adharCardLocalPath || !passingCertificateLocalPath) {
    throw new ApiError(400, "Avatar, Adhar, passing certificate required");
  }

  const avatar = await uploadFileToS3(avatarLocalPath);
  const adharCard = await uploadFileToS3(adharCardLocalPath);
  const passingCertificate = await uploadFileToS3(passingCertificateLocalPath);

  if (!avatar || !adharCard || !passingCertificate) {
    throw new ApiError(400, "Images not uploaded on s3");
  }

  const official = await Official.create({
    avatar: avatar,
    adharCard: adharCard,
    passingCertificate: passingCertificate,
    email,
    birthDate,
    firstName,
    middleName,
    lastName,
    phoneNo,
    gender,
    adharNumber,
    password,
    passingYear,
  });

  const createdOfficial = await Official.findById(official._id).select(
    "-password"
  );
  if (!createdOfficial) {
    throw new ApiError(500, "something went wrong while creating official");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdOfficial, "Official created successfully")
    );
});

const LoginOfficial = LoginUtil(Official);

export { registerOfficial, LoginOfficial };
