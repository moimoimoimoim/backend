const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const meetingRouter = require("./routes/meetingRouter");
const usersRouter = require("./routes/usersRouter");
const oauthRouter = require("./routes/oauthRouter");
const scheduleRouter = require("./routes/scheduleRouter");
const loginRequired = require("./utils/login-required");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { authenticateJWT } = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", meetingRouter);
app.use("/users", usersRouter);
app.use("/schedules", authenticateJWT, scheduleRouter);
app.use("/", oauthRouter);

const MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://127.0.0.1:27017";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "mongoMoim";
const EXPRESS_PORT = process.env.EXPRESS_PORT || 8080;

mongoose
  .connect(MONGO_DB_URL, {
    dbName: MONGO_DB_NAME,
  })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((error) => {
    console.error(`MongoDB Connection Error: ${error}`);
  });

app.listen(EXPRESS_PORT, () => {
  console.log(`Server Started... Port: ${EXPRESS_PORT}`);
});
