import mongoose from "mongoose";

const mongoUrl = 'mongodb://127.0.0.1:27017/jobPortalDB';

const connectDB = async () => {
    try{

        await mongoose.connect(mongoUrl);
        console.log("DataBase Connection Done!");

    }catch(err) {

        console.log("DataBase Connection Failed!", err);
    }
};

export default connectDB;