const express = require("express");
const router = express.Router();
const User = require("../schemas/users");
const Group = require("../schemas/groups");

router.post("/", async (req, res) => {
  try {
    const { email } = req.user;
    const { name } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const newGroup = await Group.create({
      name,
      user: foundUser._id,
    });

    return res.json({ message: "Created group", group: newGroup });
  } catch (e) {
    return res.status(400).json({ message: "Bad request" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { email } = req.user;

    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const foundGroups = await Group.find({ user: foundUser._id });
    return res.json({ groups: foundGroups });
  } catch {
    return res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
