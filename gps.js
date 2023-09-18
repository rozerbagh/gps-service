const net = require("net");

const SERVER_PORT = 3005; // Set the port you want to listen on.

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
const server = net.createServer((socket) => {
  console.log("GPS tracker connected.");

  // Listen for data from the GPS tracker.
  socket.on("data", (data) => {
    const gpsData = data.toString("utf8"); // Convert the binary data to a string.
    console.log("Got GPS tracker data.", gpsData);
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

server.listen(SERVER_PORT, () => {
  console.log(`GPS server is listening on port ${SERVER_PORT}`);
});
