import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Validator } from "../Util/validator";
import { userModel } from "../database/models/User";

class Authenticator {
  static async verify(req: Request, res: Response, next: NextFunction) {
    req.user = null;
    let header = `${req.headers.authorization}`;
    let isValid = Validator.validateToken(header);
    if (!isValid) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    let token = header.split(" ")[1];
    let result = null;
    try {
      result = jwt.verify(token, process.env.JWT_SECRET) as { _id: string };
    } catch (error) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    let user = await userModel.findById(result._id, {
      password: 0,
    });

    if (!user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    let reqUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };
    req.user = reqUser;

    //req.user = result;
    next();
    return;
  }
}

export { Authenticator };
