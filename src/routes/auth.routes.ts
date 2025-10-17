import { Router } from "express";
import {
  authGoogleCallback,
  cerrarsesion,
  iniciarSesion,
  verificarsesion,
  verificarToken,
} from "../controllers/auth.controller.js";
import { registrarUsuario } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/iniciarsesion", iniciarSesion);

router.post("/registrar", registrarUsuario);

router.get("/verificartoken", verificarToken);

router.post("/google/callback", authGoogleCallback);

router.get("/verificarsesion", verificarsesion);

router.get("/cerrarsesion", cerrarsesion);
export default router;
