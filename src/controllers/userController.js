const userService = require("../services/userService.js");
const bcrypt = require("bcryptjs");

class UserController {
  async signup(req, res) {
    const { email, password, nickname, agreedTerms } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userService.createUser({
        email,
        password: hashedPassword,
        nickname,
        agreedTerms,
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error during sign up:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      await userService.login(req, res);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    const { email } = req.body;

    try {
      await userService.deleteUser(email);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error during account deletion:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async logout(req, res) {
    try {
      await userService.logout(req, res);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    const { email, newEmail, nickname, password } = req.body;

    try {
      await userService.updateUser({
        email,
        newEmail,
        nickname,
        password,
      });
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error during user update:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getMyPage(req, res) {
    try {
      await userService.getMyPage(req, res);
    } catch (err) {
      console.error("회원정보 조회 중 에러 발생:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new UserController();
