const port = process.env.PORT || 8800;
const net = require("net");
const http = require("http");
const app = require("./app");
const SOCKET_SERVER_PORT = 3005; // Set the port you want to listen on.
const HTTP_SERVER_PORT = 3006;
const gpsDataFunc = (gpsData) => {
  try {
    // Split the data by commas
    const fields = gpsData.split(",");

    // Extract relevant fields
    const identifier = fields[1];
    const latitude = fields[5];
    const longitude = fields[7];
    const speed = fields[8];
    const date = fields[3];
    const time = fields[9];

    console.log(`===========================`);
    console.log(`Identifier: ${identifier}`);
    console.log(`Latitude: ${latitude}`);
    console.log(`Longitude: ${longitude}`);
    console.log(`Speed: ${speed}`);
    console.log(`Date: ${date}`);
    console.log(`Time: ${time}`);
    console.log(`===========================`);
  } catch (error) {
    console.log(error);
  }
};
const httpserver = http.createServer(app);
const socketserver = net.createServer((socket) => {
  console.log("GPS tracker connected.");

  // Listen for data from the GPS tracker.
  socket.on("data", (data) => {
    const gpsData = data.toString("utf8"); // Convert the binary data to a string.
    console.log("Got GPS tracker data.", new Date().getTime(), gpsData);
    gpsDataFunc(gpsData);
    // Here, you can parse and process the GPS data as needed.
    // For example, you can split the data into fields and extract information.
  });

  // Handle socket close or errors.
  socket.on("close", () => {
    console.log("GPS tracker disconnected.");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

socketserver.listen(SOCKET_SERVER_PORT, () => {
  console.log(`GPS socket server is listening on port ${SOCKET_SERVER_PORT}`);
});

httpserver.listen(HTTP_SERVER_PORT, () => {
  console.log(`GPS http server is listening on port ${HTTP_SERVER_PORT}`);
});

// const io = new Server(server, {
//   // options
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
//   },
// });
// io.on("connection", (socket) => {
//   // ...
//   console.log(":::: wss has been connected ::::", socket);
//   io.sockets.emit("hi", "everyone");
//   io.sockets.emit("data", (data) => {
//     console.log(data);
//   });
//   io.sockets.emit("message", (data) => {
//     console.log(data);
//   });
//   io.sockets.emit("pool", (data) => {
//     console.log(data);
//   });
//   io.sockets.emit("Pool", (data) => {
//     console.log(data);
//   });
// });
// io.on("new_namespace", (namespace) => {
//   console.log(namespace.name);
// });

// server.listen(port, () => {
//   console.log("server is running on port : " + port);
// });
