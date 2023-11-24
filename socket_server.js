const net = require("net");
const WebSocket = require("ws");
const gpsDataFunc = (gpsData, wss) => {
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

    return {
      data: { identifier, latitude, longitude, speed, date, time, fields },
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: error,
    };
  }
};

// Create a WebSocket server attached to the HTTP server
function websocketConnection(httpserver) {
  const wss = new WebSocket.Server({ server: httpserver });

  // Handle WebSocket connections
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected.");

    ws.on("message", (message) => {
      console.log(`Received message from client: ${message}`);
      // Process the message received from the WebSocket client
      // You can broadcast this message to all connected WebSocket clients if needed
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected.");
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });
  const socketserver = net.createServer((_socket) => {
    console.log("GPS tracker connected.");

    // Listen for data from the GPS tracker.
    _socket.on("data", (data) => {
      const gpsData = data.toString("utf8"); // Convert the binary data to a string.
      console.log("Got GPS tracker data.", new Date().getTime(), gpsData);
      const res = gpsDataFunc(gpsData, wss);
      console.log(res.data, res.error);
      // Process the data received from the TCP client

      // Forward data to WebSocket clients
      wss.clients.forEach((client) => {
        console.log(client);
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });

    // Handle socket close or errors.
    _socket.on("close", () => {
      console.log("GPS tracker disconnected.");
    });

    _socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  return { net: socketserver, ws: wss };
}
module.exports = { websocketConnection };
