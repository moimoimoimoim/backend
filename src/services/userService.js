//userService.js
const User = require("../schemas/users");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwtUtils");

class UserService {
  // 사용자 생성
  async createUser({ email, password, nickname, agreedTerms }) {
    const newUser = new User({
      email,
      password,
      nickname,
      agreedTerms,
      registrationDate: new Date(),
      lastModifiedDate: new Date(),
      isActive: true,
      isCalendarLinked: false,
    });

    await newUser.save();
    return newUser;
  }

  // 로그인 처리
  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("가입되지 않은 이메일입니다.");
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const payload = { email: user.email, isAdmin: user.isAdmin };
    const token = generateToken(payload);

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    return res.status(200).json({ message: "로그인 성공", user, token });
  }

  // 사용자 삭제
  async deleteUser(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }
    if (email !== tokenEmail) {
      throw new Error("Unauthorized: Token does not match the user email.");
    }

    await User.deleteOne({ email });
  }

  // 로그아웃 처리
  logout(req, res) {
    const token = req.cookies.token; // 쿠키에서 토큰을 추출

    if (!token) {
      throw new Error("로그인 상태가 아닙니다.");
    }

    res.clearCookie("token"); // 쿠키에서 토큰을 삭제
    return res.status(200).json({ message: "로그아웃 성공" });
  }

  // 사용자 정보 수정
  async updateUser({ email, newEmail, nickname, password }) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (newEmail) {
      user.email = newEmail;
    }

    if (nickname) {
      user.nickname = nickname;
    }

    user.lastModifiedDate = new Date();
    await user.save();
  }

  async findUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }
}

module.exports = new UserService();
