import { Register } from "../models/register.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerTemp = async(req, res) =>{
    const {username, password} = req.body

    console.log(username, password)

    const user = await Register.create({
        username,
        password
    })

    if (!user) {
        throw new Error('something went wrong')
    }

    return res.status(201).json(
        {data: user})
    
}

export default registerTemp