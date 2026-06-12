import express from "express";
import { createJob, getJobs, updateJob, deleteJob } from "../controllers/jobController.js";
import auth from "../Middleware/auth.js";
import isAdmin from "../Middleware/isAdmin.js";

const router = express.Router();

router.post("/", auth, isAdmin, createJob);
router.get("/", getJobs);
router.put("/:id", auth, isAdmin, updateJob);
router.delete("/:id", auth, isAdmin, deleteJob);

export default router;