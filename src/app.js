const dotenv = require("dotenv");
const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const usersRouter = require("./routes/usersRouter");
const cookieParser = require("cookie-parser");

// 서브모듈 경로
const submoduleDir = path.resolve(__dirname, "../submodule"); // 서브모듈 디렉토리 경로
const destinationDir = path.resolve(__dirname); // 복사할 위치: 현재 디렉토리

console.log("dotenv file path:", path.join(destinationDir, ".env"));
dotenv.config({ path: path.join(destinationDir, ".env") });

// .env 파일 복사
fs.copy(path.join(submoduleDir, ".env"), path.join(destinationDir, ".env"))
  .then(() => {
    console.log("Files were copied successfully!");
    dotenv.config({ path: path.join(destinationDir, ".env") });

    const app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/users", usersRouter);

    const MONGO_DB_URL = "mongodb://localhost:27017";
    const MONGO_DB_NAME = "mongoMoim";
    const EXPRESS_PORT = 8080;

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

    app.get("/", (req, res) => {
      res.send("Hello!!!");
    });

    app.listen(EXPRESS_PORT, () => {
      console.log(`Server Started... Port: ${EXPRESS_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error copying files:", err);
  });
