const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");
const joinController = require("../controllers/joinController");
const slotController = require("../controllers/slotController");
const User = require("../schemas/users");
const Schedule = require("../schemas/schedules");
const { authenticateJWT } = require("../middlewares/authMiddleware");

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const { email } = req.user;

    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const schedules = await Schedule.find({}).populate({
      path: "meeting",
      populate: {
        path: "meetingGroup",
      },
    });
    const filteredSchedules = schedules.filter(
      (schedule) => schedule.user && schedule.user._id.equals(foundUser._id)
    );
    const filteredMeetings = filteredSchedules.map(
      (schedule) => schedule.meeting
    );

    return res.json(filteredMeetings);
  } catch (e) {
    console.error(e);
  }
});

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

router.post(
  "/filter-timeslots/:meetingId",
  slotController.filterTimeSlotsController
);

router.post(
  "/confirm-schedule/:meetingId",
  authenticateJWT,
  meetingController.confirmScheduleController
);

router.get(
  "/confirm-schedule/:meetingId",
  meetingController.getConfirmedScheduleController
);

module.exports = router;
