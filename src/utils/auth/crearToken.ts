import crypto from "crypto";

export function generarToken(): string {
  const token = crypto.randomBytes(20).toString("hex");
  return token;
}
