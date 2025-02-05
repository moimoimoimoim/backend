const Schedule = require("../schemas/schedules");
const User = require("../schemas/users");

/**
 * 사용자의 모든 스케줄 조회
 * @param {String} email - 사용자 이메일
 */
async function getSchedulesByUserEmail(email) {
  try {
    const foundUser = await User.find({ email });
    const foundSchedules = await Schedule.find({ userId: foundUser._id });

    return { success: true, schedule: foundSchedules };
  } catch (error) {
    console.error("스케줄 조회 오류:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 스케줄 단일 조회
 * @param {String} scheduleId - 스케줄 ID
 */
async function getSchedule(scheduleId) {
  try {
    const foundSchedule = await Schedule.findById(scheduleId);

    return { success: true, schedule: foundSchedule };
  } catch (error) {
    console.error("스케줄 조회회 오류:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 스케줄 생성
 * @param {String} userId - 사용자 ID
 * @param {String} scheduleName - 스케줄 이름
 * @param {Array} timeslots - 스케줄 슬롯 배열 [{ slot: Number }]
 */

async function createchedule(userId, scheduleName, timeslots) {
  try {
    const newSchedule = new Schedule({
      userId,
      scheduleName,
      timeslots,
    });

    const savedSchedule = await newSchedule.save();
    return { success: true, schedule: savedSchedule };
  } catch (error) {
    console.error("스케줄 생성 오류:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 스케줄 수정
 * @param {String} scheduleId - 수정할 스케줄의 ID
 * @param {Array} timeslots - 수정할 timeslots 배열 [{ slot: Number }]
 */
async function updateSchedule(scheduleId, timeslots) {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { timeslots },
      { new: true } // 업데이트 후 변경된 문서 반환
    );

    if (!updatedSchedule) {
      return { success: false, message: "스케줄을 찾을 수 없음" };
    }
    return { success: true, schedule: updatedSchedule };
  } catch (error) {
    console.error("스케줄 수정 오류:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 스케줄 삭제
 * @param {String} scheduleId - 삭제할 스케줄의 ID
 */
async function deleteSchedule(scheduleId) {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);

    if (!deletedSchedule) {
      return { success: false, message: "스케줄을 찾을 수 없음" };
    }
    return { success: true };
  } catch (error) {
    console.error("스케줄 삭제 오류:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  getSchedulesByUserEmail,
  getSchedule,
  createchedule,
  updateSchedule,
  deleteSchedule,
};
