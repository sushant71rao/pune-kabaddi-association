import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Team, Zone } from "../models/team.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import LoginUtil from "../utils/LoginUtil.js";
import { uploadFileToS3 } from "../utils/s3Operations.js";

const registerTeam = asyncHandler(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const {
    teamName,
    email,
    phoneNo,
    startingYear,
    category,
    ageGroup,
    pinCode,
    authorizedPersonName,
    authorizedPersonPhoneNo,
    managerName,
    managerPhoneNo,
    password,
    description,
    address,
  } = req.body;

  if (
    [teamName, email, phoneNo, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await Team.findOne({
    $or: [{ teamName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "team name or email all ready exists");
  }

  const logoLocalPath = req.files?.logo[0];

  if (!logoLocalPath) {
    throw new ApiError("400", "Logo image is required");
  }

  const logo = await uploadFileToS3(logoLocalPath);

  if (!logo) {
    throw new ApiError(400, "Logo not uploaded on cloudinary");
  }
  let pAgeGroup = JSON.parse(ageGroup);
  // console.log(pAgeGroup);
  const team = await Team.create({
    logo: logo,
    teamName,
    email,
    phoneNo,
    startingYear,
    category,
    ageGroup: pAgeGroup,
    pinCode,
    authorizedPersonName,
    authorizedPersonPhoneNo,
    managerName,
    managerPhoneNo,
    password,
    description,
    address,
  });

  const createdTeam = await Team.findById(team._id).select("-password ");

  if (!createdTeam) {
    throw new ApiError("500", "something went wrong while creating the team");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "team created successfully"));
});

const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({}, { teamName: 1 });

  return res
    .status(201)
    .json(new ApiResponse(200, teams, "successfully received all teams"));
});

const getTeam = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    return next(new ApiError(401, "No query provided in request"));
  }
  const team = await Team.findOne(req.body);
  if (!team) {
    return next(new ApiError(404, "No such user found"));
  }
  const pin = Number(team?.pinCode);

  // console.log(pin);
  const zone = await Zone.findOne({ pincodes: pin }, { name: 1 });
  if (!zone) {
    return next(new ApiError(404, "No Zone Matched"));
  }

  // console.log(final);
  return res.status(200).json({
    success: true,
    team: {
      ...team?._doc,
      zone: zone?.name,
    },
  });
});

const getZone = asyncHandler(async (req, res, next) => {
  if (!req.param) {
    return next(new ApiError(401, "No parameters specified"));
  }

  console.log(req.params);
  const pin = req.params.id;
  const zone = await Zone.findOne(
    { pincodes: { $elemMatch: { pin } } },
    { name: 1 }
  );

  if (!zone) {
    return next(new ApiError(404, "No Zone Found"));
  }
  res.status(200).json({
    success: true,
    zone,
  });
});
// const logoutTeam = asyncHandler(async (req, res) => {
//   let team = await Team.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         refreshToken: undefined,
//       },
//     },
//     {
//       new: true,
//     }
//   );
//   if (!team) {
//     return next(new ApiError(404, "No Team Found"));
//   }

//   const options = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "Team logged out successfully"));
// });

const LoginTeam = LoginUtil(Team);

export { registerTeam, getAllTeams, LoginTeam, getTeam, getZone };
