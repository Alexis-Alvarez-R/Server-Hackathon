import { Router } from "express";
import { getAves, getAvesPorZona, getImagenesAves } from "../controllers/aves.controller.js";

const router = Router();

router.get("/", getAves);
router.get("/zona/:zonaId", getAvesPorZona);
router.get("/imagenes/:aveId", getImagenesAves); // /aves/imagenes/3

export default router;
