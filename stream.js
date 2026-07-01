const express = require("express");
const status = require("express-status-monitor")
const fs = require("fs");
const app = express();
const PORT = 9000;
app.use(status());
app.get("/", (req, res) => {
    // fs.readFile("./sample.txt", (err, data) => {
    //     res.end(data);
    //     })
    const stream = fs.createReadStream("./sample.txt");
    stream.on("data", (chunk) =>
        res.write(chunk));
    stream.on("end", () => res.end());
    });
    app.listen(PORT,() => {
        console.log(`Worker ${process.pid} started on port 9000`);
    });

// Types of steams

// Readable
// Writeable
// Duplex
// Transform


