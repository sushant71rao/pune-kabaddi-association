import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Zone } from "../models/team.model.js";

import { Team } from "../models/team.model.js";

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
    throw new ApiError(400, "Logo not uploaded on S3");
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
  const teams = await Team.find();

  return res
    .status(201)
    .json(new ApiResponse(200, teams, "successfully received all teams"));
});

const getTeamByPin = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    return next(new ApiError(401, "No query provided in request"));
  }
  const team = await Team.findOne(req.body);
  if (!team) {
    return next(new ApiError(404, "No such user found"));
  }
  const pin = Number(team?.pinCode);

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

const getTeam = asyncHandler(async (req, res) => {
  const teamId = req.params.id;
  const team = await Team.findById(teamId);

  if (!team) {
    throw new ApiError(404, "team not found");
  }

  return res.status(200).json(new ApiResponse(200, team, "fetched team"));
});

const deleteTeam = asyncHandler(async (req, res) => {
  const teamId = req.params.id;
  const team = await Team.findById(teamId);

  if (!team) {
    throw new ApiError(404, "team not found");
  }

  await Team.deleteOne({ _id: teamId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Player deleted successfully"));
});

const updateTeamDetails = asyncHandler(async (req, res) => {
  const { _id, ...rest } = req.body;

  const team = await Team.findByIdAndUpdate(
    req.params?.id,
    {
      $set: {
        ...rest,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, team, "Account details updated successfully"));
});

const updateLogo = asyncHandler(async (req, res, next) => {
  const logoLocalPath = req.files?.logo?.[0];

  if (logoLocalPath) {
    let logo = await uploadFileToS3(logoLocalPath);

    await Team?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        logo: logo,
      },
    });
  }

  res.status(200).json({
    success: true,
    message: "Files Updated Successfully",
  });
});

const LoginTeam = LoginUtil(Team);

export {
  registerTeam,
  getAllTeams,
  getTeam,
  deleteTeam,
  LoginTeam,
  updateLogo,
  updateTeamDetails,
  getZone,
  getTeamByPin,
};
