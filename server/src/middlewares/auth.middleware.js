import { Official } from "../models/official.model.js";
import { Player } from "../models/player.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = () =>
  asyncHandler(async (req, _, next) => {
    try {
      // console.log(req.header("Authorization"));
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized user");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      let user = await Player.findById(decodedToken?._id)
        .select("-password -refreshToken")
        .exec();

      if (!user) {
        user = await Official.findById(decodedToken?._id)
          .select("-password -refreshToken")
          .exec();
        if (!user) {
          throw new ApiError(401, "Invalid access token");
        }
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "invalid access token");
    }
  });
