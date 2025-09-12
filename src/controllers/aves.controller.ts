import { supabase } from "../data-source.js"; //siempre pon la extension .js
import type { Request, Response } from "express";

export const getAves = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("aves").select(`
      ave_id,
      nombre_comun,
      nombre_cientifico,
      descripcion,
      tamano,
      dieta,
      habitat,
      url_img,
      familias(nombre),
      estados_conservacion(nombre)
    `);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
