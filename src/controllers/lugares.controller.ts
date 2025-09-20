import { supabase } from "../data-source.js";
import type { Request, Response } from "express";

export const getLugares = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("lugares").select("*");
  console.log(data);
  return res.send(data);
};
