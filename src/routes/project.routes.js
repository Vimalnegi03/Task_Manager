import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controllers.js";
const router=Router()
app.get("/healthCheck",healthcheck)
export default router;