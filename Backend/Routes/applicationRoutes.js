// import express from "express";

// const router = express.Router();

// import { applyJob, getUserApplications } from "../controllers/applicationController.js";
// import {authMiddleware} from "../Middleware/auth.js";

// router.post(
//   "/apply/:jobId",
//   authMiddleware,
//   applyJob
// );

// router.get(
//   "/me",
//   authMiddleware,
//   getUserApplications
// );

// export default router;


import express from "express";

import {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import {
  authMiddleware,
  roleMiddleware,
} from "../Middleware/auth.js";

const router = express.Router();

router.post(
  "/:jobId",
  authMiddleware,
  roleMiddleware("USER"),
  applyJob
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("USER"),
  getMyApplications
);

router.get(
  "/job/:jobId",
  authMiddleware,
  roleMiddleware("COMPANY"),
  getJobApplicants
);

router.put(
  "/:applicationId/status",
  authMiddleware,
  roleMiddleware("COMPANY"),
  updateApplicationStatus
);

export default router;