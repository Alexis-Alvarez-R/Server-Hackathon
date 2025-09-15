import bcrtyp from "bcrypt";
import limpiarString from "./limpiarString.js";

type passswordBd = string;

export default async function compararPassword(
  passwordBd: passswordBd,
  pass: string
) {
  const password = limpiarString(pass);
  return await bcrtyp.compare(password, passwordBd);
}
