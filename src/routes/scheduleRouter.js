const express = require("express");
const router = express.Router();
const scheduleService = require("../services/scheduleService");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// 단일 스케줄 조회
router.get("/:scheduleId", async (req, res) => {
  const { scheduleId } = req.params;
  const result = await scheduleService.getSchedule(scheduleId);
  res.json(result);
});

// 로그인된 사용자의 모든 스케줄 조회
router.get("/", authenticateJWT, async (req, res) => {
  const { email } = req.user;

  const result = await scheduleService.getSchedulesByUserEmail(email);
  res.json(result);
});

// 스케줄 생성
router.post("/", async (req, res) => {
  const { userId, scheduleName, timeslots } = req.body;
  const result = await scheduleService.createSchedule(
    userId,
    scheduleName,
    timeslots
  );
  res.json(result);
});

// 스케줄 수정
router.put("/:scheduleId", async (req, res) => {
  const { scheduleId } = req.params;
  const { timeslots } = req.body;
  const result = await scheduleService.updateSchedule(scheduleId, timeslots);
  res.json(result);
});

// 스케줄 삭제
router.delete("/:scheduleId", async (req, res) => {
  const { scheduleId } = req.params;
  const result = await scheduleService.deleteSchedule(scheduleId);
  res.json(result);
});

module.exports = router;
