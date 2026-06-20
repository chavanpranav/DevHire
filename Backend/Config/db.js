// import mongoose from "mongoose";

// const mongoUrl = 'mongodb://127.0.0.1:27017/jobPortalDB';

// const connectDB = async () => {
//     try{

//         await mongoose.connect(mongoUrl);
//         console.log("DataBase Connection Done!");

//     }catch(err) {

//         console.log("DataBase Connection Failed!", err);
//     }
// };

// export default connectDB;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../Models/User.js";

const mongoUrl = 'mongodb://127.0.0.1:27017/jobPortalDB';

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "ADMIN" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin Portal",
        email: "admin@devhire.com",
        password: hashedPassword,
        role: "ADMIN"
      });
      console.log("Seeded prototype admin: admin@devhire.com / admin123");
    } else {
      console.log("Prototype admin already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

const connectDB = async () => {
  try {

    await mongoose.connect(mongoUrl);
    console.log("DataBase Connection Done!");
    await seedAdmin();

  } catch (err) {

    console.log("DataBase Connection Failed!", err);
  }
};

export default connectDB;