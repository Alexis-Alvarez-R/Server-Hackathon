import { Router } from "express";
import {
  getImagenesLugar,
  getLugares,
} from "../controllers/lugares.controller.js";

const router = Router();

router.get("/getlugares", getLugares);

router.get("/getimageneslugar", getImagenesLugar);

export default router;
