import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Validator } from "../Util/validator";
import { userModel } from "../database/models/User";
import { Status } from "../constants/status";

class Authenticator {
  static async verify(req: Request, res: Response, next: NextFunction) {
    req.user = null;
    let header = `${req.headers.authorization}`;
    let isValid = Validator.validateToken(header);
    if (!isValid) {
      res.status(Status.InvalidToken.code).json(Status.InvalidToken);
      return;
    }

    let token = header.split(" ")[1];
    let payload: JwtPayload | null = null;
    try {
      let verify = jwt.verify(token, `${process.env.JWT_SECRET}`);

      if (typeof verify === "string") {
        throw new Error("Invalid Token");
      }

      payload = verify as JwtPayload;
    } catch (e) {
      res.status(Status.InvalidToken.code).json(Status.InvalidToken);
      return;
    }

    let result = { _id: payload._id };
    let tokenCreated = new Date((payload.iat || 0) * 1000);
    let user = await userModel.findById(result._id);

    if (!user || user.lastValidLogin > tokenCreated) {
      res.status(Status.Unauthorized.code).json(Status.Unauthorized);
      return;
    }

    let reqUser = {
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
