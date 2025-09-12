//CONEXION A LA BD
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";

dotenv.config(); // esto carga el .env

//Supabase
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

//Google
export const clienteGoogleId = process.env.CLIENT_GOOGLE_ID as string;

export const clienteGoogle = new OAuth2Client(clienteGoogleId);

//Correo
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
