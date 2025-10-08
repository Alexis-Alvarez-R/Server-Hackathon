import { type Request } from "express";

export default interface AuthRequest extends Request {
  session?: {
    id_usuario: string | undefined;
    name: string | undefined;
    email: string | undefined;
    picture: string | undefined;
  };
  cookies: {
    access_token?: string;
    [key: string]: any;
  };
}
