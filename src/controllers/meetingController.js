const meetingService = require("../services/meetingService");

const getMeetingByInviteTokenController = async (req, res) => {
  try {
    const { inviteToken } = req.params;
    const meeting = await meetingService.getMeetingByInviteToken(inviteToken);

    if (!meeting) {
      return res
        .status(404)
        .json({ message: "유효하지 않은 초대 링크입니다." });
    }

    res.status(200).json(meeting);
  } catch (error) {
    console.error("Error fetching meeting by inviteToken:", error);
    res
      .status(500)
      .json({ message: "서버 오류로 인해 모임 정보를 가져올 수 없습니다." });
  }
};

const getMeetingSchedulesController = async (req, res) => {
  try {
    const schedules = await meetingService.getMeetingSchedules(meetingId);

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: "일정이 없습니다." });
    }

    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching meeting schedules:", error);
    res
      .status(500)
      .json({ message: "서버 오류로 인해 일정을 가져올 수 없습니다." });
  }
};

const generateInviteController = async (req, res) => {
  const {
    meeting_name,
    meeting_code,
    meetingDay,
    meetingTime,
    meetingRole,
    meetingGroup,
  } = req.body;

  console.log("User Info:", req.user); // req.user의 전체 정보 출력

  // req.user가 없거나, email이 없으면 에러 처리
  if (!req.user || !req.user.email) {
    return res.status(400).json({ message: "User info missing or invalid." });
  }

  const user_email = req.user.email;
  const userId = req.user.userId;
  // 필수 필드 체크
  if (!meeting_name || !meeting_code || !user_email) {
    return res
      .status(400)
      .json({ message: "meeting_name, email, and meeting_code are required." });
  }

  try {
    const result = await meetingService.generateInvite(
      meeting_name,
      meeting_code,
      meetingDay,
      meetingTime,
      meetingRole,
      meetingGroup,
      user_email,
      req // 전체 req 객체 전달
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating meeting:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMeetingByInviteTokenController,
  getMeetingSchedulesController,
  generateInviteController,
};
