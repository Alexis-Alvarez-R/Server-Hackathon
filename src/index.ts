//MAIN (PUNTO DE ENTRADA)

import express from "express";
import cors from "cors";
import { supabase } from "./data-source.js"; //siempre pon la extension .js

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

// Obtener todas las aves
app.get("/aves", async (req, res) => {
  const { data, error } = await supabase.from("aves").select(`
      ave_id,
      nombre_comun,
      nombre_cientifico,
      descripcion,
      tamano,
      dieta,
      habitat,
      familias(nombre),
      estados_conservacion(nombre)
    `);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(PORT, () => {
  console.log("Servidor corriendo");
});
