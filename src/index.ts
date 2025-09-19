//MAIN (PUNTO DE ENTRADA)

import express from "express";
import cors from "cors";

import auth from "./routes/auth.routes.js";
import aves from "./routes/aves.routes.js";
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

app.listen(PORT, () => {
  console.log("Servidor corriendo");
});
