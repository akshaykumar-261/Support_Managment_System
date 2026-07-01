const cluster = require("node:cluster");
const os = require("node:os");
const express = require("express");
const totalCPU = os.cpus().length;
//console.log(`Total CPU: ${totalCPU}`);
if (cluster.isPrimary) {
  console.log(`Primary Process: ${process.pid}`);
  for (let i = 0; i < totalCPU; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  app.get("/", (req, res) => {
    res.json({
      message: `Hello from Worker ${process.pid}`,
    });
  });
  app.listen(8000, () => {
    console.log(`Worker ${process.pid} started on port 8000`);
  });
}
