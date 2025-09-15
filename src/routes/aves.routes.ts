import { Router } from "express";
import { getAves, getAvesPorZona } from "../controllers/aves.controller.js";

const router = Router();

router.get("/", getAves);
router.get("/zona/:zonaId", getAvesPorZona);

export default router;
