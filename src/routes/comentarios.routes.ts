import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  Comentar,
  getComentarios,
  editarComentario,
  deleteComentario,
} from "../controllers/comentarios.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/comentar", Comentar);

router.get("/getcomentarios/:id_lugar", getComentarios);

router.patch("/editarcomentario", editarComentario);

router.delete("/deleteComentario/:id_comentario", deleteComentario);

export default router;
