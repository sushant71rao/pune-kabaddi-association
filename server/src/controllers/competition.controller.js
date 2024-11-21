import Competition from "../models/competition.model.js";
import { uploadFileToS3 } from "../utils/s3Operations.js";
// import Team from "../models/Team.js";
// import Player from "../models/Player.js";

export const createCompetition = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      organizer,
      organiserContact,
      zone,
      ageGroup,
    } = req.body;

    // console.log(req.body);
    // console.log(req.files?.posterImage?.[0]);
    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !location ||
      !organizer ||
      !organiserContact ||
      !zone ||
      !ageGroup
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }
    if (!req?.files?.posterImage) {
      return res.status(400).json({ message: "A Poster image is Required" });
    }

    const posterImage = await uploadFileToS3(req?.files?.posterImage?.[0]);

    // Create a new competition document
    const newCompetition = new Competition({
      title,
      description,
      startDate,
      endDate,
      location,
      organizer,
      organiserContact,
      zone,
      ageGroup,
      posterImage,
    });

    const savedCompetition = await newCompetition.save();

    res.status(201).json({
      message: "Competition created successfully.",
      competition: savedCompetition,
    });
  } catch (error) {
    console.error("Error creating competition:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /api/v1/competitions
export const getCompetitions = async (req, res) => {
  try {
    const currentDate = new Date();
    const competitions = await Competition.find({
      startDate: { $gte: currentDate },
    }).sort({ startDate: 1 });
    res.status(200).json(competitions);
  } catch (error) {
    console.error("Error fetching competitions:", error);
    res.status(500).json({ message: "Failed to fetch competitions." });
  }
};

export const competitionDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Competition.findOne({ _id: id });

    if (!data) {
      res.status(404).json({ Success: false, message: "Data not found" });
      return;
    }
    res.status(200).json({ Success: true, data: data });
    return;
  } catch (err) {
    res.status(404).json({ Success: false, message: "Internal server error!" });
  }
};

export const AddTeam = async (req, res) => {
  try {
    const id = req.params.id;
    const teamId = req.body.teamId;
    const update = await Competition.updateOne(
      { _id: id },
      { $addToSet: { teams: teamId } }
    );

    if (!update) {
      console.log("Competition Not Found");
      res.status(404).json({ message: "Competition Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Team Registered Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
