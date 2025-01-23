//oauthRouter.js
const express = require("express");
const oauthController = require("../controllers/oauthController");

const router = express.Router();

router.get("/login/oauth2/google", oauthController.startGoogleOAuth);

router.get(
  "/login/oauth2/google/callback",
  oauthController.handleGoogleCallback
);
router.get("/signup/redirect", oauthController.handleSignupRedirect);
router.post("/signup", oauthController.signup);

module.exports = router;
