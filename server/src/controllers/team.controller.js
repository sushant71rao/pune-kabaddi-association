import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Team } from "../models/team.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const registerTeam = asyncHandler(async (req, res) => {

    const {
        teamName,
        email,
        phoneNo,
        startingYear,
        category,
        ageGroup,
        zone,
        authorizedPersonName,
        authorizedPersonPhoneNo,
        managerName,
        managerPhoneNo,
        password,
        description
    }
        = req.body


    if (
        [teamName, email, phoneNo, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await Team.findOne({
        $or: [{ phoneNo }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "team with email or phone number all ready exists")
    }

    const logoLocalPath = req.files?.logo[0]?.path;

    if (!logoLocalPath) {
        throw new ApiError("400", "Logo image is required")
    }

    const logo = await uploadOnCloudinary(logoLocalPath)

    if (!logo) {
        throw new ApiError(400, "Logo not uploaded on cloudinary")
    }

    const team = await Team.create({

        logo: logo.url,
        teamName,
        email,
        phoneNo,
        startingYear,
        category,
        ageGroup,
        zone,
        authorizedPersonName,
        authorizedPersonPhoneNo,
        managerName,
        managerPhoneNo,
        password,
        description,

    })

    const createdTeam = await Team.findById(team._id).select("-password ")

    if (!createdTeam) {
        throw new ApiError('500', 'something went wrong while creating the team')
    }

    return res.status(201).json(
        new ApiResponse(200, createdTeam, "team created successfully")
    )
})

const getAllTeams = asyncHandler(async (req, res) => {
    const teams = await Team.find()
    return res.status(201).json(new ApiResponse(200, teams, "successfully received all teams"))
})

export { registerTeam, getAllTeams }