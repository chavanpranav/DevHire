import express from "express";
const app = express();

import connectDB from "./Config/db.js";
connectDB();

app.use(express.json());


import cors from "cors";
app.use(cors());

import Job from "./Models/Job.js";
import jobRoutes from "./Routes/jobRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import signUpRoutes from "./Routes/signUpRoutes.js";





app.use("/api/jobs", jobRoutes);

app.use("/api", authRoutes);

app.use("/api", signUpRoutes);

app.get("/", (req, res) => {
    res.send("This Is Root Page");
});

app.listen(8080, () => {
    console.log("Server Is Listining On Port 8080");
})