import { clienteGoogle, clienteGoogleId } from "../data-source.js";
import { supabase } from "../data-source.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transporter } from "../data-source.js";
import type { Request, Response } from "express";
import type reqRegistrar from "../interfaces/iReqRegistrar.js";

import dotenv from "dotenv";

dotenv.config();

export const inicioSesion = (req: Request, res: Response) => {};

export const registrarUsuario = async (
  req: Request<{}, {}, reqRegistrar, {}>,
  res: Response
) => {
  try {
    console.log("vamosss");
    const { nombre, email, password } = req.body;

    const { data: data1, error: error1 } = await supabase
      .from("usuarios")
      .select("id_usuario")
      .eq("email", email)
      .maybeSingle();

    if (data1) {
      return res
        .status(400)
        .json({ mensaje: "Error el usuario ya esta registrado" });
    }
    if (error1) {
      console.log(error1);
      console.log("error 1");
      throw new Error("Error problemas con la consulta");
    }

    const hashPassword: string = await bcrypt.hash(password, 7);
    const token = crypto.randomBytes(20).toString("hex");

    const { data: data2, error: error2 } = await supabase
      .from("usuarios")
      .insert([
        {
          email: email,
          password: hashPassword,
          nombre: nombre,
          imagenurl: null,
          verificado: false,
          token_verificacion: token,
        },
      ]);

    if (error2) {
      console.log(error2);
      console.log("errror 2");
      throw new Error("Error al insertar usuario -supabase");
    }
    console.log(data2);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verifica tu correo",
      html: `<p>Haz click en el link para verificar tu cuenta:</p>
                   <a href="http://localhost:${process.env.PORT}/verify?token=${token}">Verificar correo</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Usuario creado. Revisa tu correo para verificar tu cuenta.",
    });
  } catch (error) {
    return res.status(400).json({ mensaje: "Errorrrr" });
  }
};

export const authgoogleCallback = async (req: Request, res: Response) => {
  console.log("se hizo google");
  const { credential } = req.body;
  if (!credential) throw new Error("No hay credencial");
  console.log(req.body);
  try {
    const ticket = await clienteGoogle.verifyIdToken({
      idToken: credential,
      audience: clienteGoogleId,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("No hay payload");
    const { email, name, picture } = payload;

    res.json({ email, name, picture });
  } catch (err) {
    res.status(400).send("Token inválido");
  }
};
