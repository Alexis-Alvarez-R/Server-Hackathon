//MAIN (PUNTO DE ENTRADA)

import express from "express";
import cors from "cors";

import auth from "./routes/auth.routes.js";
import aves from "./routes/aves.routes.js";
import { transporter } from "./data-source.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obtener todas las aves
app.use("/aves", aves);

app.use("/auth", auth);

transporter.verify((error, success) => {
  if (error) {
    console.log("Error al conectar con el servidor de correo:", error);
  } else {
    console.log("Servidor de correo listo para enviar emails");
  }
});

app.listen(PORT, () => {
  console.log("Servidor corriendo");
});
