export default interface usuario {
  id_usuario?: number;
  email: string;
  password: string;
  nombre: string;
  imagenUrl?: string | null;
  verificado: boolean;
  token_verificacion: string | null;
  fechaExpiracion?: string;
  fecha_creacion?: string;
}

//No la uso pero pronto
