const express = require("express");
const app = express();

const connectDB = require("./Config/db.js")
connectDB();


const job = require("./Models/job.js");
/*const testJob = new job({
    title: "Frontend Developer",
    company: "XYZ Company",
    location: "Bangalore",
    description: "Work on React projects"
});*/

console.log(testJob);

app.get("/", (req, res) => {
    res.send("This Is Root Page");
});

app.listen(8080, () => {
    console.log("Server Is Listining On Port 8080");
})