const mongoose = require("mongoose");

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

const job = mongoose.model("job", jobSchema);

module.exports = job;