import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  LoginOfficial,
  registerOfficial,
} from "../controllers/official.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register-official").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "adharCard", maxCount: 1 },
    { name: "passingCertificate", maxCount: 1 },
  ]),
  registerOfficial
);

// router.route("/get-teams").get(getAllTeams)

router.route("/login").post(LoginOfficial);

// // Secured route
// router.route("/logout").post(verifyJWT, logoutUser)
// router.route("/refresh-token").post( refreshAccessToken)

export default router;
