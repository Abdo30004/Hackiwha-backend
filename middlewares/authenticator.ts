import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { Validator } from "../Util/validator";
import { userModel } from "../database/models/User";

import { Status } from "../constants/status";

import process from "process";
class Authenticator {
  static async verify(req: Request, res: Response, next: NextFunction) {
    req.user = null;
    const header = `${req.headers.authorization}`;
    const isValid = Validator.validateToken(header);
    if (!isValid) {
      res.status(Status.InvalidToken.code).json(Status.InvalidToken);
      return;
    }

    const token = header.split(" ")[1];
    let payload: JwtPayload | null = null;
    try {
      const verify = jwt.verify(token, `${process.env.JWT_SECRET}`);

      if (typeof verify === "string") {
        throw new Error("Invalid Token");
      }

      payload = verify as JwtPayload;
    } catch (e) {
      res.status(Status.InvalidToken.code).json(Status.InvalidToken);
      return;
    }

    const result = { _id: payload._id };
    const tokenCreated = new Date((payload.iat || 0) * 1000);
    const user = await userModel.findById(result._id);

    if (!user || user.lastValidLogin > tokenCreated) {
      res.status(Status.Unauthorized.code).json(Status.Unauthorized);
      return;
    }

    const reqUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      lastValidLogin: user.lastValidLogin,
    };
    req.user = reqUser;

    //req.user = result;
    next();
    return;
  }
}

export { Authenticator };
