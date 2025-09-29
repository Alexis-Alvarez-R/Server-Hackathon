import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { webUrl } from "../../index.js";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function enviarCorreo(email: string, token: string) {
  try {
    const msg = {
      to: email,
      from: "rumbonicaapp@gmail.com",
      subject: "Bienvenido a RumboNica",
      html: `<p>Haz click en el link para verificar tu cuenta:</p>
                   <a href="${webUrl}/auth/verificartoken?tokenVerificacion=${token}">Verificar correo</a>`,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
}
