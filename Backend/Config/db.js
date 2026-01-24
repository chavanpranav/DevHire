const mongoose = require("mongoose");

const mongoUrl = 'mongodb://127.0.0.1:27017/jobPortalDB';

async function main() {

    try{

        await mongoose.connect(mongoUrl);
        console.log("DataBase Connectio Done!");
    }catch(err) {

        console.log("DataBase Connection Failed!", err);
    }
}


main();

