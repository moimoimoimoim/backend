const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
  meeting_name: { type: String, required: true },
  meeting_code: { type: String, required: false },
  meeting_day: { type: Date, required: false },
  meeting_time: { type: String, required: true, default: "12:00 PM" },
  meeting_role: {
    type: String,
    enum: ["HOST", "PARTICIPANT"],
    default: "HOST",
  },
  meeting_group: { type: String, required: false },
  meeting_link: { type: String, required: false },
  invite_token: { type: String, required: false },
  expires_at: { type: Date, required: true },
  meeting_schedule: [{ type: Schema.Types.ObjectId, ref: "MeetingSchedule" }],
  member_total: { type: Number, default: 0 },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
