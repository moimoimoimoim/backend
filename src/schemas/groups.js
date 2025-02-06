const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: mongoose.Schema.Types.String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }],
});

module.exports = mongoose.model("Group", groupSchema);
