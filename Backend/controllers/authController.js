import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Name, email and password required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name, 
            email,
            password: hashedPassword,
            role: role || "USER" 
        });

        await user.save();

        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create user" });
    }
};

export const login = async (req, res) => {
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
            process.env.JWT_SECRET || "SECRET_KEY_1234", 
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
};

