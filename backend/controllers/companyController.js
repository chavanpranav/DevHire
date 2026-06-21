import Company from "../Models/Company.js";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ─────────────────────────────────────────────
//  COMPANY AUTH
// ─────────────────────────────────────────────

export const registerCompany = async (req, res) => {
  try {
    const { name, email, password, companyName, description } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "COMPANY",
    });

    const company = await Company.create({
      user: user._id,
      name: companyName,
      description,
    });

    res.status(201).json({
      message: "Company registered successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.role !== "COMPANY") {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
//  ADMIN — COMPANY MANAGEMENT
// ─────────────────────────────────────────────

/**
 * GET /api/company/all
 * Returns all companies with their linked user info. ADMIN only.
 */
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("user", "name email createdAt")
      .sort({ createdAt: -1 });

    res.json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/company/stats
 * Returns aggregate counts for the admin dashboard. ADMIN only.
 */
export const getCompanyStats = async (req, res) => {
  try {
    const total = await Company.countDocuments();
    const verified = await Company.countDocuments({ isVerified: true });
    const unverified = total - verified;

    res.json({ success: true, stats: { total, verified, unverified } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/company/:id/verify
 * Toggles the isVerified flag on a company. ADMIN only.
 */
export const verifyCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    company.isVerified = !company.isVerified;
    await company.save();

    res.json({
      success: true,
      message: `Company ${company.isVerified ? "verified" : "unverified"} successfully`,
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/company/:id
 * Deletes a company and its linked user account. ADMIN only.
 */
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Also remove the linked user account
    await User.findByIdAndDelete(company.user);
    await Company.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};