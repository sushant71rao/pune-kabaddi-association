import { Official } from "../models/official.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const registerOfficial = asyncHandler(async (req, res) => {

    res.setHeader('contentType', 'application/json')
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
    } = req.body

    if ([firstName, middleName, lastName, email, phoneNo, passingYear, gender, adharNumber, password].some((field) => field?.trim() == "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedOfficial = await Official.findOne({ email })

    if (existedOfficial) {
        throw new ApiError(409, "Official with email Id already exists")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    const adharCardLocalPath = req.files?.adharCard[0]?.path;
    const passingCertificateLocalPath = req.files?.passingCertificate[0]?.path;

    if (!avatarLocalPath || !adharCardLocalPath || !passingCertificateLocalPath) {
        throw new ApiError(400, "Avatar, Adhar, passing certificate required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const adharCard = await uploadOnCloudinary(adharCardLocalPath)
    const passingCertificate = await uploadOnCloudinary(passingCertificateLocalPath)

    if (!avatar || !adharCard || !passingCertificate) {
        throw new ApiError(400, "Images not uploaded on Cloudinary");
    }

    const official = await Official.create(
        {
            avatar: avatar.url,
            adharCard: adharCard.url,
            passingCertificate: passingCertificate.url,
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
        }
    )

    const createdOfficial = await Official.findById(official._id).select('-password')
    if (!createdOfficial) {
        throw new ApiError(500, 'something went wrong while creating official')
    }

    return res.status(201).json(
        new ApiResponse(200, createdOfficial, 'Official created successfully')
    )
}
)

export { registerOfficial }