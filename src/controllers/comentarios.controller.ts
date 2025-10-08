import type { Response } from "express";
import type AuthRequest from "../interfaces/iAuthRequest.js";
import { supabase } from "../data-source.js";

export async function Comentar(req: AuthRequest, res: Response) {
  const { id_lugar, puntuacion, contenido } = req.body;

  const id_usuario = req.session?.id_usuario;

  try {
    if (!id_usuario) {
      return res
        .status(403)
        .json({ mensaje: "Debe autenticarse para comentar" });
    }

    const { data, error } = await supabase
      .from("comentarios")
      .insert([{ id_lugar, id_usuario, contenido, puntuacion }])
      .select()
      .single();

    console.log(data);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ mensaje: "upps ocurrio algo" });
  }
}

export async function getComentarios(req: AuthRequest, res: Response) {
  const id_lugar = Number(req.params.id_lugar);
  console.log(id_lugar);

  try {
    if (!id_lugar) {
      return res.status(400).json({ mensaje: "Incluya el id del lugar" });
    }

    const { data, error } = await supabase
      .from("comentarios")
      .select(
        `
    id_comentario,
    contenido,
    puntuacion,
    fecha_creacion,
    usuarios(id_usuario, nombre, imagenurl)
  `
      )
      .eq("id_lugar", id_lugar)
      .order("fecha_creacion", { ascending: false });

    console.log(data);
    if (error) throw new Error("Error al consultar datos");
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ mensaje: "Upps intentelo mas tarde" });
  }
}
