import { transporter } from "../../data-source.js";
import dotenv from "dotenv";

dotenv.config();

export default async function enviarGmail(email: string, token: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verifica tu correo",
    html: `<p>Haz click en el link para verificar tu cuenta:</p>
                   <a href="http://localhost:${process.env.PORT}/auth/verificartoken?tokenVerificacion=${token}">Verificar correo</a>`,
  };

  await transporter.sendMail(mailOptions);
}
