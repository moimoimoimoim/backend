//oauthController.js
const oauthService = require("../services/oauthService");

class OAuthController {
  async startGoogleOAuth(req, res) {
    try {
      const url = oauthService.getGoogleOAuthURL();
      res.redirect(url);
    } catch (error) {
      console.error("Error starting Google OAuth:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async handleGoogleCallback(req, res) {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Google OAuth2 코드가 없습니다.");
    }

    try {
      const userData = await oauthService.processGoogleCallback(code);

      if (userData.isNewUser) {
        return res.redirect(
          `${process.env.GOOGLE_SIGNUP_REDIRECT_URI}?email=${userData.email}&name=${userData.name}`
        );
      }

      res.cookie("token", userData.token, { httpOnly: true, maxAge: 3600000 });
      return res
        .status(200)
        .json({ message: "로그인 성공", user: userData.user });
    } catch (error) {
      console.error("Google OAuth2 인증 실패:", error);
      res.status(500).json({ message: "Google OAuth2 인증 실패" });
    }
  }

  async signup(req, res) {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "필수 데이터가 누락되었습니다." });
    }

    try {
      const newUser = await userService.createUser({ email, name, password });
      return res.status(201).json({ message: "회원가입 성공", user: newUser });
    } catch (error) {
      console.error("회원가입 중 오류:", error);
      return res.status(500).json({ message: "회원가입 실패" });
    }
  }

  async handleSignupRedirect(req, res) {
    const { email, name } = req.query;

    if (!email || !name) {
      return res
        .status(400)
        .json({ message: "email 또는 name이 누락되었습니다." });
    }
    res.redirect(
      `/signup?email=${encodeURIComponent(email)}&name=${encodeURIComponent(
        name
      )}`
    );
  }
}

module.exports = new OAuthController();
