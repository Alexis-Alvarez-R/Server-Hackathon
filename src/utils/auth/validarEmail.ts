export default function validarEmail(email: string): boolean {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (isEmail) {
    return true;
  }
  return false;
}
