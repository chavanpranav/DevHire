import Company from "../Models/Company.js";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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