import { Router } from "express";
import {
  LoginTeam,
  getAllTeams,
  registerTeam,
} from "../controllers/team.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register-team").post(
  // upload.fields([{ name: "logo", maxCount: 1 }]),
  registerTeam
);

router.route("/get-teams").get(getAllTeams);

router.route("/login").post(LoginTeam);

// // Secured route
// router.route("/logout").post(verifyJWT, logoutUser);
// router.route("/refresh-token").post( refreshAccessToken)

export default router;
