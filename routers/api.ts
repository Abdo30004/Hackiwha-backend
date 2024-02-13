import { Router } from "express";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";

import { Validator } from "../Util/validator";
import { Hasher } from "../Util/hasher";
import { userModel } from "../database/models/User";
import { User } from "../types/user";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello in API V1",
  });
});
router.get("/user", (req, res) => {
  res.json({
    message: "User",
  });
});

router.post("/user/register", async (req, res) => {
  let validStatus = Validator.validateUser(req.body);

  if (!validStatus.valid) {
    res.status(400).json({
      message: validStatus.message,
    });
    return;
  }

  let user = req.body as User;

  let userExist = await userModel.findOne({
    $or: [{ email: user.email }, { username: user.username }],
  });

  if (userExist) {
    res.status(409).json({
      message: "User Already Exist",
    });
    return;
  }

  user._id = v4();

  let token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  let hash = await Hasher.hashPassword(user.password);

  user.password = hash;

  let data = new userModel(user);

  await data.save();

  res.json({
    message: "User Created",
    token: `Bearer ${token}`,
  });
});

let apiRouterConfig = {
  router,
  path: "/api",
};

export { apiRouterConfig };
