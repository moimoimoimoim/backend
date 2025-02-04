//usersRouter.js
const express = require("express");
const userController = require("../controllers/userController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const router = express.Router();

// 회원가입
router.post("/signup", userController.signup);

// 로그인
router.post("/login", userController.login);

// 탈퇴
router.delete("/delete", userController.delete);

// 로그아웃
router.post("/logout", userController.logout);

// 회원정보 수정
router.put("/update", userController.update);

//마이페이지 (내정보조회)
router.get("/my-page", authenticateJWT, userController.getMyPage);

module.exports = router;
