//schemas/meeting.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Schedule = require("./schedules");

const meetingSchema = new Schema({
  meeting_name: { type: String, required: true },
  meeting_code: { type: String, required: false },
  timeslots: [
    {
      slot: { type: Number, required: true },
    },
  ],
  meeting_role: {
    type: String,
    enum: ["HOST", "PARTICIPANT"],
    default: "HOST",
  },
  group: { type: String, required: false },
  meeting_link: { type: String, required: false },
  invite_token: {
    type: String,
    required: true,
    unique: true, // 고유 인덱스 추가
  },
  expires_at: { type: Date, required: true },
  meeting_schedule: [{ type: Schema.Types.ObjectId, ref: "Schedule" }],
  member_total: { type: Number, default: 0 },
  confirmed_schedule: {
    type: {
      start: { type: Number },
      end: { type: Number },
    },
    required: false,
  }, // 확정된 시간표 저장
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
