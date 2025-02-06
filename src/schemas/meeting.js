//schemas/meeting.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  meetingName: { type: String, required: true },
  meetingCode: { type: String, required: false },
  meetingGroup: { type: Schema.Types.ObjectId, ref: "Group", required: false },
  meetingTimezone: [
    {
      slot: { type: Number, required: true },
    },
  ],
  meetingSchedules: [{ type: Schema.Types.ObjectId, ref: "Schedule" }],
  memberTotal: { type: Number, default: 0 },
  inviteToken: { type: String },
  isExpired: { type: Boolean, required: true },
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
