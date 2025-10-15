import { Router } from "express";
import { getComercios } from "../controllers/comercios.controller.js";

const router = Router();

router.get("/getcomercios/:idlugar", getComercios);

export default router;
