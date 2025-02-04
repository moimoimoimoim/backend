// controllers/joinController.js
const { joinMeetingService } = require("../services/meetingService");

const joinController = async (req, res) => {
  const { inviteToken, participantCode, nickname, availableTimes } = req.body;

  try {
    const result = await joinMeetingService(
      inviteToken,
      participantCode,
      nickname,
      availableTimes,
      req.session
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { joinController };
