//MAIN (PUNTO DE ENTRADA)

import express from "express";
import cors from "cors";

import auth from "./routes/auth.routes.js";
import aves from "./routes/aves.routes.js";
import lugares from "./routes/lugares.routes.js";
import comentarios from "./routes/comentarios.routes.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;

const netlify = "https://rumbonica.netlify.app";
const local = "http://localhost:5173";
export const webUrl = netlify;

const app = express();
app.use(cors({ origin: webUrl, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obtener todas las aves
app.use("/aves", aves);

app.use("/auth", auth);

app.use("/lugares", lugares);

app.use("/comentarios", comentarios);

app.listen(PORT, () => {
  console.log("Servidor corriendo");
});
