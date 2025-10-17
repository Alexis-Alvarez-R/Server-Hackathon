const cantidadNumeros = 4;

export default function validarSeguridadPassword(password: string) {
  if (password.length < 8) {
    return "Password no es segura";
  }

  const numerosPassword = password.split("").filter((caracter) => {
    const letra = Number(caracter);
    if (!isNaN(letra)) {
      return caracter;
    }
  });

  if (numerosPassword.length < cantidadNumeros) {
    return `Minimo ${cantidadNumeros} numeros  en la contraseña`;
  }
}
