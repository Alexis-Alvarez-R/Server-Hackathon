import { Router } from "express";
import {
  descubreIA,
  getImagenesLugar,
  getLugares,
} from "../controllers/lugares.controller.js";

const router = Router();

router.get("/getlugares", getLugares);

router.get("/getimageneslugar", getImagenesLugar);

router.post("/descubreia", descubreIA);

export default router;
