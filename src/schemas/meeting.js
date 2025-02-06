//schemas/meeting.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Schedule = require("./schedules");

const meetingSchema = new Schema({
  meetingName: { type: String, required: true },
  meetingCode: { type: String, required: false },
  meetingTimezone: [
    {
      slot: { type: Number, required: true },
    },
  ],
  meetingSchedules: [{ type: Schema.Types.ObjectId, ref: "Schedule" }],
  memberTotal: { type: Number, default: 0 },
  inviteToken: { type: String },
  confirmedSchedule: {
    type: {
      start: { type: Number },
      end: { type: Number },
    },
    required: false,
  }, // 확정된 시간표 저장
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
