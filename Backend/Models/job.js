import mongoose from "mongoose";

const jobSchema = new mongoose.Schema (
    {

        title : {
            type : String,
            required : true
        },
        company : {
            type : String,
            required : true
        },
        location: {
            type: String,
            required: true
        },
        description: {
            type: String
        }

    }
);

// const Job = mongoose.model("Job", jobSchema);

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;