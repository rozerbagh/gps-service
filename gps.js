const net = require("net");

const SERVER_PORT = 3005; // Set the port you want to listen on.

const server = net.createServer((socket) => {
  console.log("GPS tracker connected.");

  // Listen for data from the GPS tracker.
  socket.on("data", (data) => {
    const gpsData = data.toString("utf8"); // Convert the binary data to a string.
    console.log("GPS Data:", gpsData);

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

server.listen(SERVER_PORT, () => {
  console.log(`GPS server is listening on port ${SERVER_PORT}`);
});
