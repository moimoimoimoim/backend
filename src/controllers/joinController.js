const meetingService = require("../services/meetingService");

const joinController = async (req, res) => {
  const { inviteToken, participantCode, nickname, availableTimes } = req.body;

  try {
    const result = await meetingService.joinMeetingService(
      inviteToken,
      participantCode,
      nickname,
      availableTimes,
      req.session // 세션 정보를 전달
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

async function getParticipantsController(req, res) {
  const { meeting_schedule } = req.params;

  console.log(`API 호출됨. meeting_schedule: ${meeting_schedule}`);

  try {
    const nicknames = await meetingService.getParticipants(meeting_schedule);

    console.log("조회된 닉네임 목록:", nicknames);

    return res.status(200).json({
      success: true,
      message: "참여자 닉네임 조회 성공",
      data: nicknames,
    });
  } catch (error) {
    console.error("닉네임 조회 중 오류 발생:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const getMeetingCountController = async (req, res) => {
  const { inviteToken } = req.params;

  try {
    const participantCount = await meetingService.getMeetingCount(inviteToken);

    return res.status(200).json({ success: true, participantCount });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  joinController,
  getParticipantsController,
  getMeetingCountController,
};
