import express from "express";

const router = express.Router();

import { applyJob, getUserApplications } from "../controllers/applicationController.js";
import {authMiddleware} from "../Middleware/auth.js";

router.post(
  "/apply/:jobId",
  authMiddleware,
  applyJob
);

router.get(
  "/me",
  authMiddleware,
  getUserApplications
);

export default router;