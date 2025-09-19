import { type Request } from "express";

export default interface AuthRequest extends Request {
  session?: {
    name: string | undefined;
    email: string | undefined;
  };
  cookies: {
    access_token?: string;
    [key: string]: any;
  };
}
