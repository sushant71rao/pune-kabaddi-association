import { Router } from "express";
import {
  getAllPlayers,
  getCurrentPlayer,
  getPlayer,
  LoginPlayer,
  logoutPlayer,
  registerPlayer,
  updateFiles,
  updatePlayerDetails,
} from "../controllers/player.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Player } from "../models/player.model.js";
// import multer from "multer";
// import path from "path";
const router = Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

router.route("/register-player").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "adharCard", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "achievementDocument", maxCount: 1 },
  ]),
  registerPlayer
);
router.route("/update-files/:id").patch(
  // upload.single("avatar"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
  ]),
  updateFiles
);
router.route("/login").post(LoginPlayer);
router.route("/get-players").get(getAllPlayers);
router.route("/get-player/:id").get(getPlayer);
router.route("/update-player-details/:id").patch(updatePlayerDetails);

//secured routes
router.route("/logout").post(verifyJWT(), logoutPlayer);
router.route("/current-player").get(verifyJWT(Player), getCurrentPlayer);

export default router;
