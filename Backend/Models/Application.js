import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema ({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    jobId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Job",
        required : true
    },
    status: {
      type: String,
      enum: [
        "APPLIED",
        "UNDER_REVIEW",
        "INTERVIEW_SCHEDULED",
        "ACCEPTED",
        "REJECTED",
      ],
      default: "APPLIED",
    },
    appliedAt: {
        type: Date,
        default: Date.now
  }
  
},
{ timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;