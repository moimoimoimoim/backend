const dotenv = require("dotenv");
const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const meetingRouter = require("./routes/meetingRouter");
const usersRouter = require("./routes/usersRouter");
const oauthRouter = require("./routes/oauthRouter");
const scheduleRouter = require("./routes/scheduleRouter");
const loginRequired = require("./utils/login-required");
const cookieParser = require("cookie-parser");

const submoduleDir = path.resolve(__dirname, "../submodule");
const destinationDir = path.resolve(__dirname);
const cors = require("cors"); // ✅ CORS 모듈 추가

// .env 파일 복사 및 설정
fs.copy(path.join(submoduleDir, ".env"), path.join(destinationDir, ".env"))
  .then(() => {
    dotenv.config({ path: path.join(destinationDir, ".env") });

    const app = express();
    // ✅ CORS 허용 (모든 요청 허용 또는 특정 출처만 허용)
    app.use(
      cors({
        origin: "http://localhost:5173", // 프론트엔드 주소
        credentials: true, // 쿠키 등 인증 관련 정보 포함 가능
      })
    );

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/", meetingRouter);
    app.use("/users", usersRouter);
    app.use("/schedule", loginRequired, scheduleRouter);
    app.use("/", oauthRouter);

    const MONGO_DB_URL =
      process.env.MONGO_DB_URL || "mongodb://localhost:27017";
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
  })
  .catch((err) => {
    console.error("Error copying files:", err);
  });
