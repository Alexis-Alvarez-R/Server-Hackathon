import { Router } from "express";
import {
  authgoogleCallback,
  iniciarSesion,
  verificarToken,
} from "../controllers/auth.controller.js";
import { registrarUsuario } from "../controllers/auth.controller.js";

const router = Router();

router.post("/iniciarsesion", iniciarSesion);

router.post("/registrar", registrarUsuario);

router.get("/verificartoken", verificarToken);

router.post("/google/callback", authgoogleCallback);
export default router;
