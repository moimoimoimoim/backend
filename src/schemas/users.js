const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// User 스키마 정의
const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true }, // userId를 숫자로 설정
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  agreedTerms: { type: Boolean, required: true },
  registrationDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isCalendarLinked: { type: Boolean, default: false },
});

const mongooseSequence = require("mongoose-sequence")(mongoose);

userSchema.plugin(mongooseSequence, { inc_field: "userId" });

module.exports = mongoose.model("User", userSchema);
