const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role: {
        type: String,
        default: "user"
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;