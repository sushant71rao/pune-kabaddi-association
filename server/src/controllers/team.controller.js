import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Team } from "../models/team.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import LoginUtil from "../utils/LoginUtil.js";

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

  const logoLocalPath = req.files?.logo[0]?.path;

  if (!logoLocalPath) {
    throw new ApiError("400", "Logo image is required");
  }

  const logo = await uploadOnCloudinary(logoLocalPath);

  if (!logo) {
    throw new ApiError(400, "Logo not uploaded on cloudinary");
  }

  const team = await Team.create({
    logo: logo.url,
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
  });

  const createdTeam = await Team.findById(team._id).select("-password ");

  if (!createdTeam) {
    throw new ApiError("500", "something went wrong while creating the team");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdTeam, "team created successfully"));
});

const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find();
  console.log("hit at search teams");
  return res
    .status(201)
    .json(new ApiResponse(200, teams, "successfully received all teams"));
});

const LoginTeam = LoginUtil(Team);

export { registerTeam, getAllTeams, LoginTeam };
