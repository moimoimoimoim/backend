const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");
const joinController = require("../controllers/joinController");
const slotController = require("../controllers/slotController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

app.post("/create", authMiddleware, async (req, res) => {
  // ✅ 인증 미들웨어가 적용됨
  const { meeting_name, meeting_code, timeslots, meeting_role } = req.body;

  if (!meeting_name || !meeting_code) {
    return res.status(400).json({ error: "모임 정보가 부족합니다." });
  }

  res.status(201).json({ message: "✅ 모임 생성 완료!" });
});

// router.post(
//   "/create", // create
//   authenticateJWT,
//   meetingController.generateInviteController
// );
router.post("/join/:inviteToken", joinController.joinController);
router.post("/create", (req, res) => {
  res.status(200).json({ message: "✅ 일정 생성 완료!" });
});
router.get(
  "/join/:inviteToken",
  meetingController.getMeetingByInviteTokenController
);
router.get(
  "/schedule/:meetingId",
  meetingController.getMeetingSchedulesController
);

router.delete(
  "/:meetingId",
  authenticateJWT,
  meetingController.deleteMeetingController
);

//스케줄에서 저장된 닉네임 목록 조회
router.get(
  "/participants/:meeting_schedule",
  joinController.getParticipantsController
);

// 회의 참여자 수 조회
router.get(
  "/participant-count/:inviteToken",
  joinController.getMeetingCountController
);

router.post("/filter-timeslots", slotController.filterTimeSlotsController);

router.post(
  "/confirm-schedule",
  authenticateJWT,
  meetingController.confirmScheduleController
);

router.get(
  "/confirm-schedule/:inviteToken",
  meetingController.getConfirmedScheduleController
);

router.get("/meetings", (req, res) => {
  res.json({ meetings: [] });
});

module.exports = router;
