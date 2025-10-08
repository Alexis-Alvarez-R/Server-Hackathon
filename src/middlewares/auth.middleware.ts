import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import type AuthRequest from "../interfaces/iAuthRequest.js";

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT as string;

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.access_token;
  req.session = {
    id_usuario: undefined,
    name: undefined,
    email: undefined,
    picture: undefined,
  };
  if (!token) return next();

  try {
    const data = jwt.verify(token, SECRET_KEY_JWT) as {
      id_usuario: string;
      name: string;
      email: string;
      picture: string;
    };
    req.session = {
      id_usuario: data.id_usuario,
      name: data.name,
      email: data.email,
      picture: data.picture,
    };
  } catch {}
  return next();
}
