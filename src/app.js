//app.js
const dotenv = require("dotenv");
const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/usersRouter");
const oauthRouter = require("./routes/oauthRouter");
const cookieParser = require("cookie-parser");

// 서브모듈 경로
const submoduleDir = path.resolve(__dirname, "../submodule");
const destinationDir = path.resolve(__dirname);

// .env 파일 복사 및 설정
fs.copy(path.join(submoduleDir, ".env"), path.join(destinationDir, ".env"))
  .then(() => {
    dotenv.config({ path: path.join(destinationDir, ".env") });

    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/users", usersRouter);
    app.use("/", oauthRouter);

    const MONGO_DB_URL =
      process.env.MONGO_DB_URL || "mongodb://localhost:27017";
    const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "mongoMoim";
    const EXPRESS_PORT = process.env.EXPRESS_PORT || 8080;

    // MongoDB 연결
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

    // 서버 시작
    app.listen(EXPRESS_PORT, () => {
      console.log(`Server Started... Port: ${EXPRESS_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error copying files:", err);
  });
