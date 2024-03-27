import { asyncHandler } from "../utils/asyncHandler.js ";
import { ApiError } from "../utils/ApiError.js";
import { Player } from "../models/player.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import LoginUtil from "../utils/LoginUtil.js";
import { Official } from "../models/official.model.js";

const generateAccessAndRefreshToken = async (playerId) => {
  try {
    const player = await Player.findById(playerId);

    const accessToken = player.generateAccessToken();
    const refreshToken = player.generateRefreshToken();

    player.refreshToken = refreshToken;
    await player.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generation refresh and access token"
    );
  }
};

const loginPlayer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email || password)) {
    throw new ApiError(400, "email or phone number and password is required");
  }

  const player = await Player.findOne({ email });

  if (!player) {
    throw new ApiError(404, "Player does not exit");
  }

  const isPasswordValid = await player.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid player credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    player._id
  );

  const loggedInPlayer = await Player.findById(player._id).select(
    "-password -refresh"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { player: loggedInPlayer, accessToken, refreshToken },
        "player logged in successfully"
      )
    );
});

const registerPlayer = asyncHandler(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const {
    firstName,
    middleName,
    lastName,
    email,
    phoneNo,
    gender,
    birthDate,
    teamName,
    playingSkill,
    adharNumber,
    password,
    achievements,
  } = req.body;

  if (
    [
      firstName,
      middleName,
      lastName,
      teamName,
      gender,
      adharNumber,
      email,
      phoneNo,
      password,
      birthDate,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedPlayer = await Player.findOne({
    email,
  });

  if (existedPlayer) {
    throw new ApiError(409, "player with email all ready exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const adharCardLocalPath = req.files?.adharCard[0]?.path;
  const birthCertificateLocalPath = req.files?.birthCertificate?.[0]?.path;

  if (!avatarLocalPath || !adharCardLocalPath) {
    throw new ApiError(400, "Avatar and Adhar card are required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const adharCard = await uploadOnCloudinary(adharCardLocalPath);

  let birthCertificate = "";

  if (birthCertificateLocalPath) {
    try {
      birthCertificate = await uploadOnCloudinary(birthCertificateLocalPath);
    } catch (error) {
      console.error("Failed to upload birthCertificate:", error);
    }
  }

  if (!avatar || !adharCard) {
    throw new ApiError(400, "Avatar or Adhar card not uploaded on Cloudinary");
  }

  const player = await Player.create({
    avatar: avatar.url,
    adharCard: adharCard.url,
    birthCertificate: birthCertificate?.url || "",
    email,
    birthDate,
    firstName,
    middleName,
    lastName,
    phoneNo,
    gender,
    teamName,
    playingSkill,
    adharNumber,
    password,
    achievements,
  });

  const createdPlayer = await Player.findById(player._id).select("-password ");

  if (!createdPlayer) {
    throw new ApiError("500", "something went wrong while creating the player");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdPlayer, "player created successfully"));
});

const getAllPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find();
  return res
    .status(201)
    .json(new ApiResponse(200, players, "successfully fetched all players"));
});

const getPlayer = asyncHandler(async (req, res) => {
  const playerId = req.params.id;
  const player = await Player.findById(playerId);

  if (!player) {
    throw new ApiError(404, "player not found");
  }

  return res.status(200).json(new ApiResponse(200, player, "fetched player"));
});

const getCurrentPlayer = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Player fetched successfully"));
});

const updatePlayerDetails = asyncHandler(async (req, res) => {
  const { _id, ...rest } = req.body;
  // if (!firstName || !email) {
  //   throw new ApiError(400, "All fields are required");
  // }

  const player = await Player.findByIdAndUpdate(
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
    .json(new ApiResponse(200, player, "Account details updated successfully"));
});

const logoutPlayer = asyncHandler(async (req, res) => {
  let player = await Player.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  if (!player) {
    player = await Official?.findByIdAndUpdate(
      req?.user?._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );
    if (!player) {
      return next(new ApiError(404, "No User Found"));
    }
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Player logged out successfully"));
});

const updateFiles = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const adharCardLocalPath = req.files?.aadharCard?.[0]?.path;
  const birthCertificateLocalPath = req.files?.birthCertificate?.[0]?.path;

  if (avatarLocalPath) {
    let avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log(avatar);
    let res = await Player?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        avatar: avatar?.url,
      },
    });
  }
  if (adharCardLocalPath) {
    let aadhar = await uploadOnCloudinary(adharCardLocalPath);
    await Player?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        adharCard: aadhar?.url,
      },
    });
  }
  if (birthCertificateLocalPath) {
    let birth = await uploadOnCloudinary(birthCertificateLocalPath);
    await Player?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        birthCertificate: birth?.url,
      },
    });
  }
  res.status(200).json({
    success: true,
    message: "Files Updated Successfully",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const player = await Player.findById(decodedToken?._id);

    if (!player) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== player?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(player._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const LoginPlayer = LoginUtil(Player);

export {
  registerPlayer,
  getAllPlayers,
  LoginPlayer,
  getPlayer,
  updatePlayerDetails,
  updateFiles,
  loginPlayer,
  getCurrentPlayer,
  logoutPlayer,
  refreshAccessToken,
};
