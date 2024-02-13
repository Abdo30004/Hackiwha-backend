import { Request, Response, NextFunction } from "express";
import chalk from "chalk";
class Logger {
  public static info(req: Request, _res: Response, next: NextFunction) {
    console.log(
      `${chalk.blue(req.method)} ${chalk.green(req.url)} ${chalk.greenBright(
        new Date().toLocaleDateString("en-US")
      )} ${chalk.greenBright(new Date().toLocaleTimeString("en-US"))}`
    );
    next();
  }
  public static error(
    error: Error,
    _req: Request,
    _res: Response,
    next: NextFunction
  ) {
    console.error(error);
    next(error);
  }
}
export default Logger;
export { Logger };
