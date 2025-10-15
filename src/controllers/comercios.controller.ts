import type { Response } from "express";
import type AuthRequest from "../interfaces/iAuthRequest.js";
import { supabase } from "../data-source.js";

export async function getComercios(req: AuthRequest, res: Response) {
  console.log("get comercios");
  const idlugar = Number(req.params.idlugar);
  try {
    const { data, error } = await supabase
      .from("comercioslocales")
      .select("*")
      .eq("id_lugar", idlugar);

    if (error) throw new Error("Error al obtener los comercios");

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener la data" });
  }
}
