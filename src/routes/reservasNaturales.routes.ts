import { Router } from "express";
import { getReservas, getAvesPorReserva, getReservasPorAve } from "../controllers/aves.controller.js";

const router = Router();

router.get("/", getReservas); // /reservas
router.get("/:id/aves", getAvesPorReserva); // /reservas/:id/aves
router.get("/ave/:id", getReservasPorAve); // /reservas/ave/:id

export default router;
