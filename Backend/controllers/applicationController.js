// import Application from "../Models/Application.js";
// import Job from "../Models/job.js";

// export const applyJob = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const jobId = req.params.jobId;

//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     const alreadyApplied = await Application.findOne({
//       userId: userId, 
//       jobId: jobId,
//     });

//     if (alreadyApplied) {
//       return res.status(400).json({ message: "Already applied" });
//     }

//     const application = await Application.create({
//       userId: userId, 
//       jobId: jobId,
//     });

//     res.status(201).json({
//       success: true,
//       application,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // Get applications for the logged-in user
// export const getUserApplications = async (req, res) => {
//   try {
//     const applications = await Application.find({ userId: req.user.id })
//       .populate('jobId', 'title company location') // Get job details
//       .sort({ appliedAt: -1 });
    
//     res.status(200).json(applications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // For Companies/Admins to update application status
// export const updateApplicationStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const application = await Application.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     res.status(200).json(application);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };









import Application from "../Models/Application.js";
import Job from "../Models/job.js";
import Company from "../Models/Company.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const alreadyApplied =
      await Application.findOne({
        applicant: userId,
        job: jobId,
      });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied",
      });
    }

    const application =
      await Application.create({
        applicant: userId,
        job: jobId,
      });

    res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyApplications = async (req,res) => {
  try {
    const applications =
      await Application.find({
        applicant: req.user.id,
      })
        .populate({
          path: "job",
          populate: {
            path: "company",
            select: "name",
          },
        });

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// import Company from "../Models/Company.js";

export const getJobApplicants = async (req,res) => {
  try {
    const company = await Company.findOne({
      user: req.user.id,
    });

    const job = await Job.findOne({
      _id: req.params.jobId,
      company: company._id,
    });

    if (!job) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const applicants =
      await Application.find({
        job: job._id,
      }).populate(
        "applicant",
        "name email"
      );

    res.json(applicants);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateApplicationStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const application =
        await Application.findById(
          req.params.applicationId
        )
          .populate("job");

      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      const company =
        await Company.findOne({
          user: req.user.id,
        });

      if (
        application.job.company.toString() !==
        company._id.toString()
      ) {
        return res.status(403).json({
          message: "Unauthorized",
        });
      }

      application.status = status;

      await application.save();

      res.json({
        message: "Status updated",
        application,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };