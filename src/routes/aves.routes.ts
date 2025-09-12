import { Router } from "express";
import { getAves } from "../controllers/aves.controller.js";

const router = Router()

router.get("/", getAves)


export default router