// import express from "express";
// import bcrypt from "bcryptjs";
// import User from "../Models/User.js";

// const router = express.Router();

// router.post("/signup", async (req, res) => {
//     try {
//         const { email, password, role } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password required" });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new User({
//             email,
//             password: hashedPassword,
//             role: role || "user" // default role
//         });

//         await user.save();

//         res.status(201).json({
//             message: "User created successfully",
//             user
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "Failed to create user" });
//     }
// });

// export default router;