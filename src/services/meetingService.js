// services/meetingService.js
const Meeting = require("../schemas/meeting");
const MeetingSchedule = require("../schemas/meetingSchedule");
const crypto = require("crypto");

const generateInviteToken = () => {
  return crypto.randomBytes(20).toString("hex"); // 20바이트 크기의 랜덤 토큰을 생성
};

const joinMeetingService = async (
  inviteToken,
  participantCode,
  nickname,
  availableTimes,
  session
) => {
  const meeting = await Meeting.findOne({ invite_token: inviteToken });

  if (!meeting) {
    throw new Error("유효하지 않은 초대 링크입니다.");
  }

  if (participantCode !== meeting.meeting_code) {
    throw new Error("참여 코드가 일치하지 않습니다.");
  }

  // 참여자로 설정
  const meetingSchedule = new MeetingSchedule({
    participant_name: nickname || session.nickname,
    available_times: availableTimes || [],
    meeting_id: meeting._id,
    role: "PARTICIPANT", // 참여자 역할
  });

  await meetingSchedule.save();
  meeting.meeting_schedule.push(meetingSchedule._id);
  meeting.member_total += 1;
  await meeting.save();

  return { message: "모임 참여 완료", availableTimes };
};

// 회의 초대 링크 생성
const generateInvite = async (
  meeting_name,
  meeting_code,
  meetingDay,
  meetingTime,
  meetingRole = "HOST", // 기본값 "HOST" 설정
  meetingGroup,
  user_email,
  req
) => {
  if (!meetingDay) {
    throw new Error("회의 날짜(meetingDay)가 필수입니다.");
  }

  // expires_at: 회의 링크 만료 시간을 meetingDay로부터 2주 후로 설정
  const expiresAt = new Date(
    new Date(meetingDay).getTime() + 14 * 24 * 60 * 60 * 1000
  ); // 2주 후

  // 초대 토큰 생성
  const inviteToken = generateInviteToken();

  // 회의 생성
  const newMeeting = new Meeting({
    meeting_name,
    meeting_code,
    meetingDay: new Date(meetingDay), // 날짜 값이 올바르게 전달되도록 변환
    meetingTime,
    meetingRole, // meetingRole이 없으면 기본값 "HOST" 사용
    meetingGroup,
    created_by: user_email,
    invite_token: inviteToken, // 초대 토큰 저장
    meeting_schedule: [], // 초기 일정은 비어 있음
    member_total: 0, // 참가자는 아직 없으므로 0
    expires_at: expiresAt, // 만료 시간을 설정
  });

  // 회의 저장
  await newMeeting.save();

  // 초대 링크 반환 (예시: '/meeting/join/{inviteToken}')
  const inviteLink = `/meeting/join/${inviteToken}`;

  return { message: "회의가 생성되었습니다.", inviteLink };
};

// 초대 토큰을 통해 모임 조회
const getMeetingByInviteToken = async (inviteToken) => {
  return await Meeting.findOne({ invite_token: inviteToken }).populate(
    "meeting_schedule"
  );
};

// 모임 ID를 통해 미팅 일정 조회
const getMeetingSchedules = async (meetingId) => {
  return await MeetingSchedule.find({ meeting_id: meetingId });
};

module.exports = {
  joinMeetingService,
  generateInvite,
};
