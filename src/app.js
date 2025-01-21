const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const usersRouter = require("./routes/usersRouter");

const cookieParser = require("cookie-parser");

const app = express();

// cookie-parser 미들웨어 추가
app.use(cookieParser());
// Middleware 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes 설정
app.use("/users", usersRouter); // usersRouter를 '/users'로 연결

// MongoDB 연결 정보
const MONGO_DB_URL = "mongodb://localhost:27017";
const MONGO_DB_NAME = "mongoMoim";

// Express 서버 포트
const EXPRESS_PORT = 8080;

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

// 기본 경로 설정
app.get("/", (req, res) => {
  res.send("Hello!!!");
});

// 서버 실행
app.listen(EXPRESS_PORT, () => {
  console.log(`Server Started... Port: ${EXPRESS_PORT}`);
});
