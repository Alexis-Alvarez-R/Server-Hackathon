import { Router } from "express";
import { getLugares } from "../controllers/lugares.controller.js";

const router = Router();

router.get("/getlugares", getLugares);

export default router;
