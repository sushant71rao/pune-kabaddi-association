import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteOfficial,
  getAllOfficials,
  getOfficial,
  LoginOfficial,
  registerOfficial,
  updateFiles,
  updateOfficialDetails,
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

router.route("/update-files/:id").patch(
  // upload.single("avatar"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "passingCertificate", maxCount: 1 },
  ]),
  updateFiles
);

// router.route("/get-teams").get(getAllTeams)

router.route("/login").post(LoginOfficial);

router.route("/get-officials").get(getAllOfficials);
router.route("/get-official/:id").get(getOfficial);
router.route("/delete-official/:id").delete(deleteOfficial);
router.route("/update-official-details/:id").patch(updateOfficialDetails);

// // Secured route
// router.route("/logout").post(verifyJWT, logoutUser)
// router.route("/refresh-token").post( refreshAccessToken)

export default router;
