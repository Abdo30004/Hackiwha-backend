import { Request, Response, NextFunction } from "express";

class Handler {
  public static notFound(_req: Request, res: Response, _next: NextFunction) {
    res.status(404).json({
      message: "Not Found",
    });
  }

  public static error(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export default Handler;
export { Handler };
