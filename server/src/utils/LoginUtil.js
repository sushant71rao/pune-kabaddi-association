import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";

const generateAccessAndRefreshToken = async (model, id) => {
  try {
    const user = await model.findById(id);
    // console.log(user, "here in generate fn");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log(accessToken, "is the access token");
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generation refresh and access token"
    );
  }
};

let LoginUtil = (Model) => {
  return asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!(email || password)) {
      throw new ApiError(400, "email or phone number and password is required");
    }

    const user = await Model.findOne({ email });

    if (!user) {
      throw new ApiError(404, "user does not exists");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    // console.log(user);
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      Model,
      user._id
    );

    // console.log(accessToken);

    const LoggedInUser = await Model.findById(user._id).select(
      "-password -refresh"
    );

    const options = {
      httpOnly: false,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: LoggedInUser, accessToken, refreshToken },
          "user logged in successfully"
        )
      );
  });
};

export default LoginUtil;
