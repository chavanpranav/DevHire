const express = require("express");
const app = express();

app.get("/", (req, res) => {

    res.send("This Is Root Page");
});

app.listen(8080, () => {
    console.log("Server Is Listining On Port 8080");
})