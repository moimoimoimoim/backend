const mongoose = require("mongoose");
const Meeting = require("../schemas/meeting");
const Schedule = require("../schemas/schedules");
const Group = require("../schemas/groups");
const crypto = require("crypto");
const User = require("../schemas/users");

// timeslots 업데이트 함수
function updateTimeslots(nickname, respondedSlots) {
  respondedSlots.forEach((slot) => {
    let existingSlot = timeslots.find((t) => t.slot === slot);

    if (existingSlot) {
      if (!existingSlot.members.includes(nickname)) {
        existingSlot.members.push(nickname);
      }
    } else {
      timeslots.push({ slot, members: [nickname] });
    }
  });

  // slot 기준 정렬
  timeslots.sort((a, b) => a.slot - b.slot);
}

const timeslots = [
  { slot: 46, members: ["user1", "user2"] },
  { slot: 47, members: ["user1", "user2"] },
  { slot: 48, members: ["user1"] },
  { slot: 49, members: ["user1"] },
  { slot: 50, members: ["user1"] },
  { slot: 51, members: ["user1"] },
  { slot: 150, members: ["user2"] },
  { slot: 151, members: ["user2"] },
  { slot: 152, members: ["user2"] },
  { slot: 153, members: ["user2"] },
];

// timeslots 필터링 함수
function filterTimeSlots(minDuration, minMembers) {
  let minMembersSlots = timeslots.filter((t) => t.members.length >= minMembers);

  if (minMembersSlots.length === 0) return [];
  minMembersSlots.sort((a, b) => a.slot - b.slot);

  let resultSlots = [];
  let tmp = [minMembersSlots[0]];

  for (let i = 1; i < minMembersSlots.length; i++) {
    if (minMembersSlots[i].slot === minMembersSlots[i - 1].slot + 1) {
      tmp.push(minMembersSlots[i]);
    } else {
      if (tmp.length >= minDuration / 30) {
        resultSlots.push({ start: tmp[0].slot, end: tmp[tmp.length - 1].slot });
      }
      tmp = [minMembersSlots[i]];
    }
  }

  if (tmp.length >= minDuration / 30) {
    resultSlots.push({ start: tmp[0].slot, end: tmp[tmp.length - 1].slot });
  }

  return resultSlots;
}

// 초대 토큰 생성
const generateInviteToken = () => {
  // let inviteToken;
  // let existingMeeting;

  // do {
  //   inviteToken = crypto.randomBytes(20).toString("hex");
  //   existingMeeting = await Meeting.findOne({ inviteToken });

  //   if (!inviteToken) {
  //     throw new Error("inviteToken이 null입니다. 다시 생성해 주세요.");
  //   }
  // } while (existingMeeting);

  // return inviteToken; // 여기에서 await을 기다리고 반환
  return crypto.randomBytes(20).toString("hex");
};

// 회의 참여하기
const joinMeetingService = async (
  inviteToken,
  participantCode,
  nickname,
  availableTimes,
  session
) => {
  // 초대 링크로 회의 찾기
  const meeting = await Meeting.findOne({ invite_token: inviteToken });

  if (!meeting) {
    throw new Error("유효하지 않은 초대 링크입니다.");
  }

  if (participantCode !== meeting.meetingCode) {
    throw new Error("참여 코드가 일치하지 않습니다.");
  }

  const userId = (session && session.userId) || null;
  const userNickname = nickname || (session && session.nickname) || "비회원";

  // 사용자의 스케줄 데이터 생성
  const scheduleData = {
    scheduleName: `${userNickname}'s Schedule`, // 사용자의 스케줄 이름
    timeslots: availableTimes.map((slot) => ({ slot })), // 사용자가 선택한 시간대
  };

  if (userId) {
    scheduleData.userId = userId;
  }

  const schedule = new Schedule(scheduleData); // 새로운 스케줄 생성
  await schedule.save(); // 스케줄 DB에 저장

  // 회의에 생성된 스케줄 추가
  meeting.meeting_schedule.push(schedule._id);
  meeting.member_total += 1; // 참여자 수 증가
  await meeting.save(); // 회의 DB에 저장

  return { message: "모임 참여 완료", availableTimes }; // 완료 메시지 반환
};

// 회의 초대 링크 생성
const generateInvite = async (
  meetingName,
  meetingCode,
  memberTotal,
  meetingGroup,
  meetingTimezone,
  ownerEmail
) => {
  try {
    if (!meetingTimezone || meetingTimezone.length === 0) {
      throw new Error("회의시간(slot)이 필수입니다.");
    }

    const foundUser = await User.findOne({ email: ownerEmail });
    if (!foundUser) throw new Error("로그인은 필수입니다.");

    // 초대 토큰 생성
    const inviteToken = generateInviteToken(); // 초대 토큰 생성 시 await 추가
    // const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 예시로 24시간 후 만료 설정

    // 사용자의 스케줄 데이터 생성 (회의 생성 시 스케쥴 DB에 사용자의 `slot` 추가)
    const scheduleData = {
      scheduleName: `${foundUser.nickname}의 일정`, // 사용자의 이름을 스케쥴 이름으로 설정
      timeslots: [],
      user: foundUser._id,
    };
    const ownerSchedule = await Schedule.create(scheduleData); // 새로운 스케쥴 생성

    // meeting 생성
    const newMeeting = await Meeting.create({
      meetingName,
      meetingCode,
      meetingTimezone, // 참여 가능한 시간대 정보
      inviteToken,
      memberTotal,
      meetingSchedules: [ownerSchedule._id], // 새로 생성한 스케쥴을 회의에 추가
      confirmedSchedule: {},
    });

    ownerSchedule.meeting = newMeeting._id;
    await ownerSchedule.save();

    if (meetingGroup) {
      const foundGroup = await Group.findById(meetingGroup);
      foundGroup.meetings = [newMeeting._id, ...foundGroup.meetings];
      await foundGroup.save();
    }

    return {
      message: "회의 초대 링크 생성 완료",
      inviteLink: `/join/${inviteToken}`,
      ownerSchedule,
      meeting: newMeeting,
    }; // 초대 링크 반환
  } catch (err) {
    console.error("회의 생성 오류: ", err);
    throw new Error("회의 초대 생성에 실패했습니다.");
  }
};

// 모임 삭제
const deleteMeeting = async (meetingId) => {
  const meeting = await Meeting.findById(meetingId);

  if (!meeting) {
    throw new Error("해당 모임을 찾을 수 없습니다.");
  }

  await Meeting.findByIdAndDelete(meetingId);
  return { message: "모임이 삭제되었습니다." };
};

// 초대 토큰을 통해 모임 조회
const getMeetingByInviteToken = async (inviteToken) => {
  return await Meeting.findOne({ invite_token: inviteToken }).populate(
    "meeting_schedule"
  );
};

//참여자 목록 조회
async function getParticipants(meetingId) {
  try {
    // meetingId로 모임 데이터 조회 (populate로 schedule 정보를 함께 가져오기)
    const meeting = await Meeting.findById(meetingId).populate(
      "meeting_schedule"
    ); // meeting_schedule ObjectId로 실제 데이터를 가져옴

    if (!meeting) {
      throw new Error("해당 모임을 찾을 수 없습니다.");
    }

    if (!meeting.meeting_schedule || meeting.meeting_schedule.length === 0) {
      throw new Error("해당 모임의 스케줄이 존재하지 않습니다.");
    }

    const nicknames = meeting.meeting_schedule.map((schedule) => {
      const nickname = schedule.scheduleName.replace("'s Schedule", "");
      console.log(`각 스케줄의 scheduleName: ${nickname}`);
      return nickname;
    });

    return nicknames;
  } catch (error) {
    console.error("닉네임 조회 중 오류 발생:", error.message);
    throw new Error(error.message || "참여자 닉네임 조회에 실패했습니다.");
  }
}

//모임참여자 수
const getMeetingCount = async (inviteToken) => {
  const meeting = await Meeting.findOne({ invite_token: inviteToken });

  if (!meeting) {
    throw new Error("회의를 찾을 수 없습니다.");
  }

  return meeting.member_total; // 참여자 수 반환
};

const getMeetingSchedules = async (meetingId) => {
  return await Schedule.find({ _id: { $in: meetingId } });
};

async function confirmScheduleController(req, res) {
  const { inviteToken, start, end, date } = req.body;

  // 필수 항목 검사
  if (!inviteToken || !start || !end || !date) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }

  try {
    // 일정에 대한 정보 확인
    const meeting = await Meeting.findOne({ invite_token: inviteToken });
    if (!meeting) {
      return res.status(404).json({ message: "회의를 찾을 수 없습니다." });
    }

    // 확정된 일정 저장
    meeting.confirmed_schedule = { start, end, date };
    await meeting.save();

    return res.status(200).json({
      message: "일정이 확정되었습니다.",
      confirmed_schedule: meeting.confirmed_schedule,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

const confirmSchedule = async (inviteToken, start, end) => {
  if (!inviteToken || !start) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  const meeting = await Meeting.findOne({ invite_token: inviteToken });

  if (!meeting) {
    throw new Error("회의를 찾을 수 없습니다.");
  }

  // 확정된 일정 저장
  meeting.confirmed_schedule = { start, end };
  await meeting.save();

  return meeting.confirmed_schedule;
};

const getConfirmedSchedule = async (inviteToken) => {
  try {
    // Find the meeting based on the invite token
    const meeting = await Meeting.findOne({ invite_token: inviteToken });

    if (!meeting) {
      throw new Error("회의를 찾을 수 없습니다.");
    }

    // Check if the confirmed schedule exists
    if (!meeting.confirmed_schedule) {
      throw new Error("확정된 일정이 없습니다.");
    }

    return meeting.confirmed_schedule;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  joinMeetingService,
  generateInvite,
  getMeetingByInviteToken,
  deleteMeeting,
  getParticipants,
  getMeetingCount,
  getMeetingSchedules,
  filterTimeSlots,
  confirmSchedule,
  getConfirmedSchedule,
};
