import { Router } from "express";
import {
  getAllPlayers,
  getCurrentPlayer,
  getPlayer,
  LoginPlayer,
  logoutPlayer,
  registerPlayer,
  updatePlayerDetails,
} from "../controllers/player.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Player } from "../models/player.model.js";

const router = Router();

router.route("/register-player").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "adharCard", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "achievementDocument", maxCount: 1 },
  ]),
  registerPlayer
);
router.route("/login").post(LoginPlayer);
router.route("/get-players").get(getAllPlayers);
router.route("/get-player/:id").get(getPlayer);
router.route("/update-player-details").patch(updatePlayerDetails);

//secured routes
router.route("/logout-player").post(verifyJWT(Player), logoutPlayer);
router.route("/current-player").get(verifyJWT(Player), getCurrentPlayer);

export default router;
