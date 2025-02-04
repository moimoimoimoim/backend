// routes/meetingRoutes.js
const express = require("express");
const router = express.Router();

const {
  generateInviteController,
  getMeetingByInviteTokenController,
  getMeetingSchedulesController,
} = require("../controllers/meetingController");
const { joinController } = require("../controllers/joinController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

router.post("/create", authenticateJWT, generateInviteController);

router.post("/join", joinController);
// routes/meetingRoutes.js
router.get("/join/:inviteToken", getMeetingByInviteTokenController);
router.get("/schedules/:meetingId", getMeetingSchedulesController);

module.exports = router;
