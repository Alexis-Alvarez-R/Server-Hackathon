//CONEXION A LA BD
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config(); // esto carga el .env

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);
