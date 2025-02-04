const jwt = require("jsonwebtoken");

function loginRequired(req, res, next) {
  const userToken = req.cookies["token"];

  if (!userToken || userToken === "null") {
    console.log(
      "서비스 사용 요청이 있습니다. 하지만, Authorization 토큰: 없음"
    );

    res.status(401).json({
      result: "forbidden-approach",
      message: "로그인한 유저만 사용할 수 있는 서비스입니다.",
    });

    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const jwtDecoded = jwt.verify(userToken, secretKey);

    const email = jwtDecoded.email;
    req.currentUserEmail = email;

    next();
  } catch (error) {
    res.status(401).json({
      result: "forbidden-approach",
      message: "정상적인 토큰이 아닙니다.",
    });

    return;
  }
}

module.exports = loginRequired;
