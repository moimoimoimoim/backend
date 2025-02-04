//controllers/meetingController.js

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
    const { meetingId } = req.params;
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
  try {
    const {
      meeting_name,
      meeting_code,
      timeslots,
      meetingRole,
      meetingGroup,
      user_id,
    } = req.body;

    if (!timeslots || timeslots.length === 0) {
      return res.status(400).json({ error: "회의시간(slot)이 필수입니다." });
    }

    const meeting = await meetingService.generateInvite(
      meeting_name,
      meeting_code,
      timeslots,
      meetingRole,
      meetingGroup,
      user_id
    );

    return res.status(201).json({ message: "회의 초대 생성 성공", meeting });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteMeetingController = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const result = await meetingService.deleteMeeting(meetingId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMeetingByInviteTokenController,
  getMeetingSchedulesController,
  generateInviteController,
  deleteMeetingController,
};
