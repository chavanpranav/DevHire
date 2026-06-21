import Job from "../Models/Job.js";
import Company from "../Models/Company.js";

export const createJob = async (req, res) => {
  try {
    const companyUserId = req.user.id;

    const company = await Company.findOne({
      user: companyUserId,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const { title, description, location, salary } =
      req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      company: company._id,
      createdBy: companyUserId,
    });

    res.status(201).json({
      message: "Job created",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const companyUserId = req.user.id;

    const company = await Company.findOne({
      user: companyUserId,
    });

    const jobs = await Job.find({
      company: company._id,
    });

    const formattedJobs = jobs.map(job => ({
      ...job.toObject(),
      company: company.name
    }));

    res.json(formattedJobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyUserId = req.user.id;

    const company = await Company.findOne({
      user: companyUserId,
    });

    const job = await Job.findOne({
      _id: jobId,
      company: company._id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or unauthorized",
      });
    }

    Object.assign(job, req.body);

    await job.save();

    res.json({
      message: "Job updated",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyUserId = req.user.id;

    const company = await Company.findOne({
      user: companyUserId,
    });

    const job = await Job.findOneAndDelete({
      _id: jobId,
      company: company._id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or unauthorized",
      });
    }

    res.json({
      message: "Job deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name description");

    const formattedJobs = jobs.map(job => {
      const jobObj = job.toObject();
      return {
        ...jobObj,
        company: job.company ? job.company.name : "Unknown Company"
      };
    });

    res.json(formattedJobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};