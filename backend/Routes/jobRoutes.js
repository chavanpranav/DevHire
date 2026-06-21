import express from "express";
// import { createJob, getJobs, updateJob, deleteJob } from "../controllers/jobController.js";

import {
  createJob,
  getCompanyJobs,
  updateJob,
  deleteJob,
  getAllJobs,
} from "../controllers/jobController.js";

import {
  authMiddleware,
} from "../Middleware/auth.js";

import {
  roleMiddleware,
} from "../Middleware/auth.js";

const router = express.Router();

// router.post("/", auth, isAdmin, createJob);
// router.get("/", getJobs);
// router.put("/:id", auth, isAdmin, updateJob);
// router.delete("/:id", auth, isAdmin, deleteJob);

router.post(
  "/",
  authMiddleware,
  // roleMiddleware("COMPANY"),
  roleMiddleware("ADMIN", "COMPANY"),
  createJob
);

router.get(
  "/",
  getAllJobs
);

router.get(
  "/company",
  authMiddleware,
  // roleMiddleware("COMPANY"),
  roleMiddleware("ADMIN", "COMPANY"),
  getCompanyJobs
);

router.put(
  "/:id",
  authMiddleware,
  // roleMiddleware("COMPANY"),
  roleMiddleware("ADMIN", "COMPANY"),
  updateJob
);

router.delete(
  "/:id",
  authMiddleware,
  // roleMiddleware("COMPANY"),
  roleMiddleware("ADMIN", "COMPANY"),
  deleteJob
);

export default router;