import bcrypt from "bcrypt";

const NUMERO_SALTOS = 7;

export default async function cifrarPassword(password: string) {
  const cifrado = await bcrypt.hash(password, NUMERO_SALTOS);
  return cifrado;
}
