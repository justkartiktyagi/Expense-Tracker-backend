const express = require("express");
const {
  getSignup,
  signup,
  getLogin,
  login,
} = require("../Controller/auth-controller");
const authRouter = express.Router();
authRouter.get("/signup", getSignup);
authRouter.post("/signup", signup);
authRouter.get("/login", getLogin);
authRouter.post("/login", login);
module.exports = authRouter;
