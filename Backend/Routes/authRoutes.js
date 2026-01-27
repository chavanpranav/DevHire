const express = require("express");
const router = express.router();

const User = require("../Models/User.js");


router.post("/login", async (req, res) => {

    const {email, password} = req.body;

    const user = await User.findOne({email, password});

    if(!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
        _id: user._id,
        email: user.email,
        role: user.role
    });

});

module.exports = router;