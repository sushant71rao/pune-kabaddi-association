import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"


export const verifyJWT =(Model)=> asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized user")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const player = Model.findById(decodedToken?._id).select("-password -refreshToken")

        if (!player) {
            throw new ApiError(401, "Invalid access token")
        }

        req.player = player
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || 'invalid access token')
    }

})