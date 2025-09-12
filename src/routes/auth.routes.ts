import { Router } from "express";
import {
  authgoogleCallback,
  inicioSesion,
} from "../controllers/auth.controller.js";
import { registrarUsuario } from "../controllers/auth.controller.js";

const router = Router();

router.get("/google/callback", inicioSesion);

router.post("/registrar", registrarUsuario);

router.post("/google/callback", authgoogleCallback);
export default router;
