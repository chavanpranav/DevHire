import express from "express";
import {
  registerCompany,
  loginCompany,
  getAllCompanies,
  getCompanyStats,
  verifyCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { authMiddleware, roleMiddleware } from "../Middleware/auth.js";

const router = express.Router();

// ── Public Auth Routes ──────────────────────────────────────────────────────
router.post("/register", registerCompany);
router.post("/login", loginCompany);

// ── Admin-Only Routes ───────────────────────────────────────────────────────
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllCompanies
);

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getCompanyStats
);

router.patch(
  "/:id/verify",
  authMiddleware,
  roleMiddleware("ADMIN"),
  verifyCompany
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCompany
);

export default router;