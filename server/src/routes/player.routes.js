import { Router } from "express";
import { getAllPlayers, getPlayer, registerPlayer } from "../controllers/player.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register-player").post(upload.fields([{ name: "avatar", maxCount: 1 }, { name: "adharCard", maxCount: 1 }, { name: "birthCertificate", maxCount: 1 }, { name: "achievementDocument", maxCount: 1 }]), registerPlayer)

router.route("/get-players").get(getAllPlayers)
router.route("/get-player/:id").get(getPlayer)

export default router