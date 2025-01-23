const axios = require("axios");
const userService = require("./userService");
const { generateToken } = require("../utils/jwtUtils");

class OAuthService {
  getGoogleOAuthURL() {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

    let url = "https://accounts.google.com/o/oauth2/v2/auth";
    url += `?client_id=${GOOGLE_CLIENT_ID}`;
    url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
    url += "&response_type=code";
    url += "&scope=email profile";

    return url;
  }

  async processGoogleCallback(code) {
    const {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_TOKEN_URL,
      GOOGLE_USERINFO_URL,
      GOOGLE_REDIRECT_URI,
    } = process.env;

    try {
      const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      });

      const { access_token } = tokenResponse.data;

      const userInfoResponse = await axios.get(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { email, name } = userInfoResponse.data;

      if (!email) {
        throw new Error("Google OAuth2에서 이메일 정보를 가져올 수 없습니다.");
      }

      const user = await userService.findUserByEmail(email);

      if (user) {
        const payload = { email: user.email, isAdmin: user.isAdmin };
        const token = generateToken(payload);

        return { user, token, isNewUser: false };
      }

      return { email, name, isNewUser: true };
    } catch (error) {
      console.error("Error processing Google callback:", error);
      throw error;
    }
  }
  async handleSignupRedirect(req, res) {
    const { email, name } = req.query;

    if (!email || !name) {
      return res.status(400).json({ message: "필수 데이터가 누락되었습니다." });
    }
    //TODO
    try {
      // 회원가입 화면으로 리디렉션(간편인증시 이메일과 이름 가져온 후 회원가입페이지로)
      const signupUrl = `${process.env.SIGNUP_PAGE_URL}?email=${email}&name=${name}`;
      return res.redirect(signupUrl);
    } catch (error) {
      console.error("회원가입 리디렉션 중 오류:", error);
      return res.status(500).json({ message: "회원가입 리디렉션 실패" });
    }
  }
}

module.exports = new OAuthService();
