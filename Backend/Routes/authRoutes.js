import express from "express";
const router = express.Router();

import User from "../Models/User.js";


import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            "SECRET_KEY",
            { expiresIn: "2h" }
        );

        res.json({
            token,
            role: user.role
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Login failed" });
    }

});


export default router;