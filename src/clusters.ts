import cluster from "cluster";
import http from "http";
import os from "os";
import process from "process";

const numCPUs = os.cpus().length;
if (cluster.isPrimary) {
  // console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 1; i <= numCPUs; i++) {
    const worker = cluster.fork();

    // Send a message to the worker process
    worker.send({ message: "Hello Worker", from: "Master" });
  }

  // Handle termination signals to gracefully exit the cluster
  process.on("SIGTERM", () => {
    // console.log("Received SIGTERM signal. Exiting gracefully...");
    // Send a termination signal to all worker processes
    for (const workerId in cluster.workers) {
      cluster?.workers[workerId]?.send("shutdown");
    }
  });

  // Handle worker process exits and restart them
  cluster.on("exit", (worker, code, signal) => {
    // console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server

  // http
  //   .createServer((req, res) => {
  //     res.writeHead(200);
  //     res.end("hello world\n" + i);
  //   })
  //   .listen(8010 + i);

  // console.log(`Worker ${process.pid} started`);
  // Handle messages from the master process
  process.on("message", (msg) => {
    // console.log(`Worker ${process.pid} received message from Master:`, msg);

    // Send a message back to the master process
    // process?.send({ message: "Hello Master", from: "Worker" + process.pid });
    if (msg === "shutdown") {
      // console.log(`Worker ${process.pid} received shutdown signal. Exiting...`);
      // Perform cleanup or other necessary tasks before exiting
      process.exit(0);
    }
  });
}
