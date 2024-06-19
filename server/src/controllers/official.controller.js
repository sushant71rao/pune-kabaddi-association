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

const getAllOfficials = asyncHandler(async (req, res) => {
  const official = await Official.find();
  return res
    .status(201)
    .json(new ApiResponse(200, official, "successfully fetched all officials"));
});

const getOfficial = asyncHandler(async (req, res) => {
  const officialId = req.params.id;
  const official = await Official.findById(officialId);

  if (!official) {
    throw new ApiError(404, "official not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, official, "fetched official"));
});

const deleteOfficial = asyncHandler(async (req, res) => {
  const officialId = req.params.id;
  const official = await Official.findById(officialId);

  if (!official) {
    throw new ApiError(404, "official not found");
  }

  await Official.deleteOne({ _id: officialId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Official deleted successfully"));
});

const getCurrentOfficial = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Official fetched successfully"));
});

const updateOfficialDetails = asyncHandler(async (req, res) => {
  const { _id, ...rest } = req.body;

  const official = await Official.findByIdAndUpdate(
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
    .json(
      new ApiResponse(200, official, "Account details updated successfully")
    );
});

const logoutOfficial = asyncHandler(async (req, res) => {
  let official = await Official.findByIdAndUpdate(
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

  if (!official) {
    official = await Official?.findByIdAndUpdate(
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
    if (!official) {
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
    .json(new ApiResponse(200, {}, "Official logged out successfully"));
});

const updateFiles = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.files?.avatar?.[0];
  const adharCardLocalPath = req.files?.aadharCard?.[0];
  const passingCertificateLocalPath = req.files?.passingCertificate?.[0];

  if (avatarLocalPath) {
    let avatar = await uploadFileToS3(avatarLocalPath);
    // console.log(avatar);
    await Official?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        avatar: avatar,
      },
    });
  }
  if (adharCardLocalPath) {
    let aadhar = await uploadFileToS3(adharCardLocalPath);
    await Official?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        adharCard: aadhar,
      },
    });
  }
  if (passingCertificateLocalPath) {
    let passingCertificate = await uploadFileToS3(passingCertificateLocalPath);
    await Official?.findByIdAndUpdate(req?.params?.id, {
      $set: {
        passingCertificate: passingCertificate,
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

    const official = await Official.findById(decodedToken?._id);

    if (!official) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== official?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(official._id);

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

export {
  registerOfficial,
  LoginOfficial,
  getAllOfficials,
  getOfficial,
  deleteOfficial,
  updateOfficialDetails,
  updateFiles,
  getCurrentOfficial,
  logoutOfficial,
  refreshAccessToken,
};
