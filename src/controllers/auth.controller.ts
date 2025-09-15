import { clienteGoogle, clienteGoogleId } from "../data-source.js";
import { supabase } from "../data-source.js";
import bcrypt from "bcrypt";
import { generarToken } from "../utils/auth/crearToken.js";
import enviarGmail from "../service/auth/enviarGmail.js";
import type { Request, Response } from "express";
import type reqRegistrar from "../interfaces/iReqRegistrar.js";
import validarEmail from "../utils/auth/validarEmail.js";
import compararPassword from "../utils/auth/compararPassword.js";

import dotenv from "dotenv";

dotenv.config();

export const iniciarSesion = async (req: Request, res: Response) => {
  try {
    console.log("Se entro en iniciarSesion");
    console.log("Esta es la cookie");
    console.log(req.cookies.access_token);
    //Desde frontend el input email se llama asi propiamente
    //pero a uso practico permito que al usuario ingresar con su
    //nombre o email en el mismo input
    const { email: identificacion, password } = req.body;

    const campo = validarEmail(identificacion) ? "email" : "nombre";
    const { data, error } = await supabase
      .from("usuarios")
      .select("email, nombre, password")
      .eq(campo, identificacion)
      .eq("verificado", true)
      .maybeSingle();

    if (error) throw new Error("Error al iniciar sesion");
    if (!data) throw new Error("Usuario no encontrado");

    if (data.password && (await compararPassword(data.password, password))) {
      const token = jwt.sign(
        { nombre: data.nombre, email: data.email },
        SECRET_KEY_JWT,
        { expiresIn: "1h" }
      );
      console.log("Todo ok en iniciar sesion");
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: true,
        secure: false,
      });
      return res.send("si se inicio sesion - ");
    }

    throw new Error("Algo fallo");
  } catch (error) {
    console.error(error);
  }
};
//Registrar usuario
export const registrarUsuario = async (
  req: Request<{}, {}, reqRegistrar, {}>,
  res: Response
) => {
  try {
    console.log("Registrar usuario");
    const { nombre, email, password } = req.body;
    const token = generarToken();

    const { data: data1, error: error1 } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error1) throw new Error("Error problemas con la consulta");

    if (data1) {
      if (!data1.verificado) {
        if (new Date() > new Date(data1.fechaexpiracion)) {
          console.log("ya expiro crar nuevo token");
          const { data: dataUpdate, error: errorUpdate } = await supabase
            .from("usuarios")
            .update({
              token_verificacion: token,
              fechaexpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000),
            })
            .eq("email", email);

          if (errorUpdate) throw new Error("Error al actualizar token en bd");
        }
        await enviarGmail(email, token);
        console.log("Se reenvio el link");
        return res.json({
          message: "Usuario creado. Revisa tu correo para verificar tu cuenta.",
        });
      }
      console.log("Ya esta registrado");
      console.log(data1);
      return res
        .status(400)
        .json({ mensaje: "Error el usuario ya esta registrado" });
    }

    const hashPassword: string = await bcrypt.hash(password, 7);

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

    if (error2) throw new Error("Error al insertar usuario -supabase");

    await enviarGmail(email, token);
    console.log("se envio gmail y se inserto en la bd");
    res.json({
      message: "Usuario creado. Revisa tu correo para verificar tu cuenta.",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ mensaje: "Errorrrr" });
  }
};

//Verificacion del token traido desde el email del usuario cuando se
//intenta registrar
export const verificarToken = async (req: Request, res: Response) => {
  console.log("Estmos en verificar Tokeeeenn");
  console.log(req.query.tokenVerificacion);

  const { tokenVerificacion } = req.query;

  if (!tokenVerificacion || typeof tokenVerificacion !== "string") {
    return res.status(400).json({ mensaje: "Token faltante o inválido" });
  }

  try {
    // Buscar el usuario por token y opcionalmente validar fecha de expiración
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("id_usuario, fechaexpiracion, verificado, nombre, email")
      .eq("token_verificacion", tokenVerificacion)
      .maybeSingle();

    console.log(usuario);
    if (error) throw error;

    if (!usuario) {
      return res.status(400).json({ mensaje: "Token inválido o ya usado" });
    }

    // Validar si ya expiró
    const ahora = new Date();
    if (usuario.fechaexpiracion && new Date(usuario.fechaexpiracion) < ahora) {
      return res.status(400).json({ mensaje: "Token expirado" });
    }

    // Marcar usuario como verificado y limpiar token
    const { error: errorUpdate } = await supabase
      .from("usuarios")
      .update({
        verificado: true,
        token_verificacion: null,
        fechaexpiracion: null,
      })
      .eq("id_usuario", usuario.id_usuario);

    if (errorUpdate) throw errorUpdate;

    const token = jwt.sign(
      { nombre: usuario.nombre, email: usuario.email },
      SECRET_KEY_JWT,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    // res.json({ mensaje: "Usuario verificado correctamente" });
    res.redirect("http://localhost:5173/Aviturismo");
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: err.message });
  }
};

import jwt from "jsonwebtoken";
dotenv.config();
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT as string;

//Registrar usuario cuando el usuario usa la autenticacion de google
export const authgoogleCallback = async (req: Request, res: Response) => {
  console.log("se hizo google");
  const { credential } = req.body;
  console.log(credential);
  if (!credential) throw new Error("No hay credencial");
  try {
    const ticket = await clienteGoogle.verifyIdToken({
      idToken: credential,
      audience: clienteGoogleId,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("No hay payload");
    const { email, name, picture } = payload;

    console.log(email, name);
    const token = jwt.sign({ email, name }, SECRET_KEY_JWT, {
      expiresIn: "1m",
    });
    console.log(token);
    res.cookie("acces_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.send("bieeen");
  } catch (err) {
    res.status(400).send("Token inválido");
  }
};
