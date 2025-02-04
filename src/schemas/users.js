const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  agreedTerms: { type: Boolean, required: true },
  registrationDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isCalendarLinked: { type: Boolean, default: false },
  meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }],
});

module.exports = mongoose.model("User", userSchema);
