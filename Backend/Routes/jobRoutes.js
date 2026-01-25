const express = require("express");
const router = express.Router();

const Job = require("../Models/job.js");

router.post("/", async (req, res) => {

    try {

        const newJob = new Job(req.body);
        await newJob.save();

        res.status(201).json(newJob);

    }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create job" });
    }

});


router.get("/", async (req, res) => {

    try{
        const jobs = await Job.find();
        res.json(jobs);

    }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
});

module.exports = router;