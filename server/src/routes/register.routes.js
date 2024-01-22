import { Router } from "express";
 
    import registerTemp from "../controllers/register.controller.js";
const router = Router()

router.route('/registerTemp').post(registerTemp)

export default router