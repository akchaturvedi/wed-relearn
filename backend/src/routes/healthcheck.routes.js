import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controlers.js";

const router = Router();

// api/v1/healthCheck/test

router.route("/").get(healthCheck);
router.route("/test").get(healthCheck);

export default router;
