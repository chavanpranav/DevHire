// import express from "express";
// const app = express();

// import connectDB from "./Config/db.js";
// connectDB();

// app.use(express.json());


// import cors from "cors";
// app.use(cors()); 
// app.use(express.json());

// import Job from "./Models/Job.js";
// import jobRoutes from "./Routes/jobRoutes.js";
// import authRoutes from "./Routes/authRoutes.js";
// import signUpRoutes from "./Routes/signUpRoutes.js";

// // import applicationRoutes from "./Routes/applicationRoutes.js";
// import applicationRoutes from "./Routes/applicationRoutes.js";


// app.use("/api/jobs", jobRoutes);

// app.use("/api", authRoutes);

// app.use("/api", signUpRoutes);

// // app.use("/api/applications", applicationRoutes);
// app.use(
//   "/api/applications",
//   applicationRoutes
// );

// app.get("/", (req, res) => {
//     res.send("This Is Root Page");
// });

// app.listen(8080, () => {
//     console.log("Server Is Listining On Port 8080");
// })










import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Highly recommended for managing environment variables like your JWT_SECRET

import connectDB from "./Config/db.js";
import jobRoutes from "./Routes/jobRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import applicationRoutes from "./Routes/applicationRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";


// Initialize environment variables
dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Removed the duplicate call to this middleware

// Routes
app.use("/api", authRoutes); // Handles both /api/login and /api/signup now
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/company", companyRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("This Is Root Page");
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Is Listening On Port ${PORT}`);
});