const express = require("express");

const router = express.Router();

const User = require("../Models/User.js");

router.post("/signup", async (req, res) => {

    try {

        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);

    }catch(err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create user" });
    }
});

module.exports = router;