// import express from "express";
// const router = express.Router();

// import Application from "../Models/Application.js";

// router.post("/apply", async (req, res) => {
//   try {
//     const { jobId } = req.body;

//     const userId = req.user.id;

//     const existingApplication = await Application.findOne({
//       userId,
//       jobId
//     });

//     if (existingApplication) {
//       return res.status(400).json({
//         message: "You have already applied for this job"
//       });
//     }

//     const newApplication = new Application({
//       userId,
//       jobId
//     });

//     await newApplication.save();

//     res.status(201).json({
//       message: "Application submitted successfully",
//       data: newApplication
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Server Error",
//       error: error.message
//     });
//   }
// });

// export default router;






import express from "express";

const router = express.Router();

import { applyJob } from "../controllers/applicationController.js";
import authMiddleware from "../middleware/auth.js";

router.post(
  "/apply/:jobId",
  authMiddleware,
  applyJob
);

export default router;