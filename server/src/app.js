import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// import dotenv from "dotenv";
// dotenv.config({ path: "./env" });

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import teamRouter from "./routes/team.routes.js";
import playerRouter from "./routes/player.routes.js";
import officialRouter from "./routes/official.routes.js";
import errorfn from "./middlewares/error.js";

// for file uploading
app.use(express.urlencoded({ extended: false }));

//routes declaration

app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/players", playerRouter);
app.use("/api/v1/officials", officialRouter);

app.use(errorfn);

export { app };
