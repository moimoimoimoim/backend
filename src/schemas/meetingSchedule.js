const mongoose = require("mongoose");

const meetingScheduleSchema = new mongoose.Schema(
  {
    participant_name: { type: String, required: true },
    available_times: { type: [String], required: true },
    meeting_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },
  },
  { timestamps: true }
);

const MeetingSchedule = mongoose.model(
  "MeetingSchedule",
  meetingScheduleSchema
);
module.exports = MeetingSchedule;
