const express = require("express");
const app = express();

const connectDB = require("./Config/db.js")
connectDB();

app.use(express.json());

const cors = require("cors");
app.use(cors());



const Job = require("./Models/job.js");


const jobRoutes = require("./Routes/jobRoutes.js");
app.use("/api/jobs", jobRoutes);




app.get("/", (req, res) => {
    res.send("This Is Root Page");
});

app.listen(8080, () => {
    console.log("Server Is Listining On Port 8080");
})