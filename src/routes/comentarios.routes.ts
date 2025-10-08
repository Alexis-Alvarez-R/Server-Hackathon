import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  Comentar,
  getComentarios,
} from "../controllers/comentarios.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/comentar", Comentar);

router.get("/getcomentarios/:id_lugar", getComentarios);

export default router;
