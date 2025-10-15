import { Router } from "express";
import { getGuiasLocales } from "../controllers/guias.controller.js";

const router = Router();

router.get("/getguias/:idlugar", getGuiasLocales);

export default router;
