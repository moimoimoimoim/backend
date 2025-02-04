const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");
const joinController = require("../controllers/joinController");
const slotController = require("../controllers/slotController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

router.post(
  "/create",
  authenticateJWT,
  meetingController.generateInviteController
);
router.post("/join/:inviteToken", joinController.joinController);

router.get(
  "/join/:inviteToken",
  meetingController.getMeetingByInviteTokenController
);
router.get(
  "/schedules/:meetingId",
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

module.exports = router;
