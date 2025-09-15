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

export const getAvesPorZona = async (req: Request, res: Response) => {
  const { zonaId } = req.params;

  if (isNaN(Number(zonaId))) {
    return res.status(400).json({ error: "zonaId debe ser un número" });
  }

  const { data, error } = await supabase
    .from("aves")
    .select(
      `
      ave_id,
      nombre_comun,
      nombre_cientifico,
      descripcion,
      tamano,
      dieta,
      habitat,
      url_img,
      familias(nombre),
      estados_conservacion(nombre),
      aves_zonas!inner(zona_id)
    `
    )
    .eq("aves_zonas.zona_id", Number(zonaId));

  if (error) return res.status(500).json({ error: error.message });

  // Limpiamos el resultado para quitar la relación innecesaria
  const result = data?.map((row: any) => {
    const { aves_zonas, ...rest } = row;
    return rest;
  });

  res.json(result);
};
