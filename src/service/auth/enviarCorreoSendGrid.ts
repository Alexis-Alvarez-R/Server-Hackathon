import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// Configurar la API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// Ruta para enviar correo
export async function enviarCorreo(email: string, token: string) {
  try {
    const msg = {
      to: email,
      from: "tucorreo@tudominio.com",
      subject: "Bienvenido",
      html: `<p>Haz click en el link para verificar tu cuenta:</p>
                   <a href="http://localhost:${process.env.PORT}/auth/verificartoken?tokenVerificacion=${token}">Verificar correo</a>`,
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
}

// export default async function enviarGmail(email: string, token: string) {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verifica tu correo",
//     html: `<p>Haz click en el link para verificar tu cuenta:</p>
//                    <a href="http://localhost:${process.env.PORT}/auth/verificartoken?tokenVerificacion=${token}">Verificar correo</a>`,
//   };

//   await transporter.sendMail(mailOptions);
// }
