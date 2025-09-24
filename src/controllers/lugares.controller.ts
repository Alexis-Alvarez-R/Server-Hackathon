import { supabase } from "../data-source.js";
import type { Request, Response } from "express";

export const getLugares = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("lugares").select("*");
  console.log(data);
  return res.send(data);
};

export const getImagenesLugar = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const { data, error } = await supabase
      .from("lugar_imagenes")
      .select("*")
      .eq("lugar_id", id);

    if (error) throw new Error("Error al obtener las imagenes");

    const arrayUrl = data.map((lugar) => lugar.url);
    return res.status(200).json(arrayUrl);
  } catch (error) {
    return res.status(500).json("Error");
  }
};
