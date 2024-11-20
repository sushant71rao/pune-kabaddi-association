import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import {
  createCompetition,
  getCompetitions,
  competitionDetails,
} from "../controllers/competition.controller.js";

const router = Router();

router
  .route("/create")
  .post(
    upload.fields([{ name: "posterImage", maxCount: 1 }]),
    createCompetition
  );

router.route("/get").get(getCompetitions);

router.route("/get/:id").get(competitionDetails);

export default router;
