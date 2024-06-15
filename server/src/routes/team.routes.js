import { Router } from "express";
import {
  LoginTeam,
  getAllTeams,
  getTeam,
  registerTeam,
  updateLogo,
  updateTeamDetails,
} from "../controllers/team.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register-team")
  .post(upload.fields([{ name: "logo", maxCount: 1 }]), registerTeam);

router.route("/get-teams").get(getAllTeams);
router.route("/get-team/:id").get(getTeam);

router.route("/login").post(LoginTeam);

router.route("/update-team-details/:id").patch(updateTeamDetails);

router.route("/update-logo/:id").patch(
  // upload.single("logo"),
  upload.fields([{ name: "logo", maxCount: 1 }]),
  updateLogo
);

// // Secured route
// router.route("/logout").post(verifyJWT, logoutUser);
// router.route("/refresh-token").post( refreshAccessToken)

export default router;
