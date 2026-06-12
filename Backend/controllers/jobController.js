import Job from "../Models/job.js";

export const createJob = async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create job" });
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
};

export const updateJob = async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body);
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: "Failed to update job" });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete job" });
    }
};