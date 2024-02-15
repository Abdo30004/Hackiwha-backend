import { Router } from "express";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";

import { Validator } from "../Util/validator";
import { Authenticator } from "../middlewares/authenticator";
import { Hasher } from "../Util/hasher";
import { userModel } from "../database/models/User";
import { User } from "../types/user";
import { Status } from "../constants/status";
import { rateLimit } from "express-rate-limit";

const router = Router();

const limiter = rateLimit({
  handler: (_req, res) => {
    res.status(Status.TooManyRequests.code).json(Status.TooManyRequests);
  },
  windowMs: 15 * 60 * 1000,
  max: 1,
  standardHeaders: true,
});

router.get("/", limiter, (req, res) => {
  res.status(Status.Welcome.code).json(Status.Welcome);
});

router.get("/user/me", Authenticator.verify, (req, res) => {
  res.json(req.user);
});

router.get("/user/logoutAll", Authenticator.verify, async (req, res) => {
  let user = req.user;
  if (!user) return;
  let userData = await userModel.findById(user._id);
  if (!userData) return;
  userData.lastValidLogin = new Date();
  await userData.save();

  res.status(Status.LogoutSuccess.code).json(Status.LogoutSuccess);
});

router.post("/user/register", async (req, res) => {
  let validStatus = Validator.validateUser(req.body);

  if (!validStatus.valid) {
    res.status(Status.BadRequest.code).json({
      ...Status.BadRequest,
      error: validStatus.message,
    });
    return;
  }

  let user = req.body as User;

  let userExist = await userModel.findOne({
    $or: [{ email: user.email }, { username: user.username }],
  });

  if (userExist) {
    res.status(Status.UserAlreadyExist.code).json(Status.UserAlreadyExist);
    return;
  }

  user._id = v4();

  let token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  let hash = await Hasher.hashPassword(user.password);

  user.password = hash;
  user.lastValidLogin = new Date();
  let data = new userModel(user);

  await data.save();

  res.status(Status.UserCreated.code).json({
    ...Status.UserCreated,
    token: `Bearer ${token}`,
  });
});

router.post("/user/login", async (req, res) => {
  let validStatus = Validator.validateLogin(req.body);

  if (!validStatus.valid) {
    res.status(Status.BadRequest.code).json({
      ...Status.BadRequest,
      error: validStatus.message,
    });

    return;
  }

  let loginInfo = req.body as { email: string; password: string };

  let userData = await userModel.findOne({ email: loginInfo.email });
  let isMatch = userData
    ? await Hasher.comparePassword(loginInfo.password, userData.password)
    : false;

  if (!userData || !isMatch) {
    res.status(Status.InvalidLogin.code).json(Status.InvalidLogin);
    return;
  }

  let token = jwt.sign({ _id: userData._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(Status.LoginSuccess.code).json({
    ...Status.LoginSuccess,
    token: `Bearer ${token}`,
  });
});

let apiRouterConfig = {
  router,
  path: "/api",
};

export { apiRouterConfig };
