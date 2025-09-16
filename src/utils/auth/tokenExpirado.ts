export default function tokenExpirado(fechaToken: string): boolean {
  const fechaActual = new Date();
  const fechaTok = new Date(fechaToken);
  return fechaActual > fechaTok;
}
