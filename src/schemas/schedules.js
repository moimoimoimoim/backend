// Schedule schema
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }, // required: false로 변경
  nonMemberUser: {
    type: String,
    required: false,
  },
  meeting: { type: mongoose.Schema.Types.ObjectId },
  scheduleName: { type: String, required: true },
  timeslots: [
    {
      slot: { type: Number, required: true },
    },
  ],
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
