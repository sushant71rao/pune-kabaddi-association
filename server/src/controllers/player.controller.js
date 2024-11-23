import { asyncHandler } from "../utils/asyncHandler.js ";
import { ApiError } from "../utils/ApiError.js";
import { Player } from "../models/player.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import LoginUtil from "../utils/LoginUtil.js";
import { uploadFileToS3 } from "../utils/s3Operations.js";
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
  console.log(req.files.avatar);

  const avatar = req.files?.avatar[0];
  const adharCard = req.files?.adharCard[0];
  const birthCertificate = req.files?.birthCertificate?.[0];

  if (!avatar || !adharCard) {
    throw new ApiError(400, "Avatar and Adhar card are required");
  }
  let avatarRes = await uploadFileToS3(avatar);
  let adharCardRes = await uploadFileToS3(adharCard);
  let birthCertificateRes = birthCertificate
    ? await uploadFileToS3(birthCertificate)
    : "";

  if (!avatarRes || !adharCardRes) {
    throw new ApiError(
      400,
      "Avatar or Adhar card or Birth Certificate not uploaded on S3"
    );
  }

  const player = await Player.create({
    avatar: avatarRes,
    adharCard: adharCardRes,
    birthCertificate: birthCertificateRes,
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

  if (!player) {
    throw new ApiError("500", "something went wrong while creating the player");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, player, "player created successfully"));
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
  console.log(player);
  if (player?.playingSkill && typeof player?.playingSkill != typeof "") {
    player.playingSkill = player.playingSkill[0];
  }
  return res.status(200).json(new ApiResponse(200, player, "fetched player"));
});

const deletePlayer = asyncHandler(async (req, res) => {
  const playerId = req.params.id;
  const player = await Player.findById(playerId);

  if (!player) {
    throw new ApiError(404, "player not found");
  }

  await Player.deleteOne({ _id: playerId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Player deleted successfully"));
});

const getCurrentPlayer = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Player fetched successfully"));
});

const updatePlayerDetails = asyncHandler(async (req, res) => {
  const { _id, ...rest } = req.body;

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
  const avatarLocalPath = req.files?.avatar?.[0];
  const adharCardLocalPath = req.files?.aadharCard?.[0];
  const birthCertificateLocalPath = req.files?.birthCertificate?.[0];

  if (avatarLocalPath) {
    let avatar = await uploadFileToS3(avatarLocalPath);
    // console.log(avatar);
    await Player?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        avatar: avatar,
      },
    });
  }
  if (adharCardLocalPath) {
    let aadhar = await uploadFileToS3(adharCardLocalPath);
    await Player?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        adharCard: aadhar,
      },
    });
  }
  if (birthCertificateLocalPath) {
    let birth = await uploadFileToS3(birthCertificateLocalPath);
    await Player?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        birthCertificate: birth,
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

const getTeamPlayers = asyncHandler(async (req, res) => {
  const teamName = req.body.teamName;
  const players = await Player?.find(
    {
      teamName: teamName,
    },
    {
      _id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      avatar: true,
      playingSkill: true,
    }
  );

  // console.log(players);

  res.status(200).json({ success: true, data: players });
});

const LoginPlayer = LoginUtil(Player);

export {
  registerPlayer,
  getAllPlayers,
  LoginPlayer,
  getPlayer,
  deletePlayer,
  updatePlayerDetails,
  updateFiles,
  loginPlayer,
  getCurrentPlayer,
  logoutPlayer,
  refreshAccessToken,
  getTeamPlayers,
};
