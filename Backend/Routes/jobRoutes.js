const express = require("express");
const router = express.Router();

const Job = require("../Models/job.js");

router.post("/", async (req, res) => {

    const { title, company, location } = req.body;
    if (!title || !company || !location) {
        return res.status(400).json({ message: "title, company, and location are required" });
    }

    try {

        const newJob = new Job(req.body);
        await newJob.save();

        res.status(201).json(newJob);

    }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create job" });
    }

});


module.exports = router;