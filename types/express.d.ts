import { RequestUser } from "./user";


declare global {
  namespace Express {
    export interface Request {
      user: RequestUser | null;
    }
  }
}
