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

//Obtener reservas

export const getReservas = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("reservas_naturales").select(`
      reserva_id,
      nombre,
      descripcion,
      latitud,
      longitud,
      url_img,
      departamentos(nombre)
    `);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// /**
//  * GET /reservas/departamento/:id
//  * Filtrar reservas por departamento
//  */
// export const getReservasPorDepartamento = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   const { data, error } = await supabase
//     .from("reservas_naturales")
//     .select("reserva_id, nombre, descripcion, latitud, longitud, url_img")
//     .eq("departamento_id", id);

//   if (error) return res.status(400).json({ error: error.message });
//   res.json(data);
// };

/**
 * GET /reservas/:id/aves
 * Obtener aves según la reserva
 */
export const getAvesPorReserva = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("aves_reservas")
    .select(
      `
      aves (
        ave_id,
        nombre_comun,
        nombre_cientifico,
        url_img,
        estado_conservacion_id
      ),
      frecuencia_avistamiento
    `
    )
    .eq("reserva_id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

/**
 * GET /aves/:id/reservas
 * Obtener reservas donde puede verse una ave específica
 */
export const getReservasPorAve = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("aves_reservas")
    .select(
      `
      reservas_naturales (
        reserva_id,
        nombre,
        latitud,
        longitud,
        url_img
      ),
      frecuencia_avistamiento
    `
    )
    .eq("ave_id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
