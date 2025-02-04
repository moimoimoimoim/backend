const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 사용자 ID
  scheduleName: { type: String, required: true }, // 사용자별 스케줄 이름
  timeslots: [
    {
      slot: { type: Number, required: true }, // 0~335 범위의 시간 슬롯
    },
  ],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
