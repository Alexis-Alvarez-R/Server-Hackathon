import type { Response } from "express";
import type AuthRequest from "../interfaces/iAuthRequest.js";
import { supabase } from "../data-source.js";

export async function getGuiasLocales(req: AuthRequest, res: Response) {
  const idLugar = req.params.idlugar;

  try {
    const { data, error } = await supabase
      .from("guias_locales")
      .select("*")
      .eq("id_lugar", idLugar);

    if (error) throw new Error("Error al obtener data");

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ mensaje: "Erro al obtener los guias" });
  }
}
