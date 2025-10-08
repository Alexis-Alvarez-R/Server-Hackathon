import { Router } from "express";
import {
  getAves,
  getAvesPorReserva,
  getAvesPorZona,
  getReservas,
  getReservasPorAve,
} from "../controllers/aves.controller.js";

const router = Router();

router.get("/", getAves);
router.get("/zona/:zonaId", getAvesPorZona);

export default router;
