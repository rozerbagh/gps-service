const net = require("net");
const WebSocket = require("ws");
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

    if (identifier === undefined || identifier === null) {
      return {
        data: JSON.stringify({
          identifier: "9172159029",
          latitude: (1246.9173 / 100).toString(),
          longitude: (7739.5024 / 100).toString(),
          speed: "E",
          date: "063343",
          time: "000.00",
          fields: [
            "*HQ",
            "9172159029",
            "V5",
            "063343",
            "A",
            "1246.9173",
            "N",
            "07739.5024",
            "E",
            "000.00",
            "000",
            "070224",
            "FFF7FBFF",
            "404",
            "45",
            "25091",
            "26571",
            "313364157#",
          ],
        }),
        error: new Error(undefined),
      };
    } else {
      return {
        data: JSON.stringify({
          identifier,
          latitude: (parseFloat(latitude) / 100).toString(),
          longitude: (parseFloat(longitude) / 100).toString(),
          speed,
          date,
          time,
          fields,
        }),
        error: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      data: JSON.stringify({
        identifier: "9172159029",
        latitude: (1246.9173 / 100).toString(),
        longitude: (7739.5024 / 100).toString(),
        speed: "E",
        date: "063343",
        time: "000.00",
        fields: [
          "*HQ",
          "9172159029",
          "V5",
          "063343",
          "A",
          "1246.9173",
          "N",
          "07739.5024",
          "E",
          "000.00",
          "000",
          "070224",
          "FFF7FBFF",
          "404",
          "45",
          "25091",
          "26571",
          "313364157#",
        ],
      }),
      error: error,
    };
  }
};

function dataToBasicBufer(params) {
  const buf = Buffer.from(params);

  // Encode the Buffer to Base64
  const base64Data = buf.toString("base64");

  // Create a JSON object with the Base64-encoded data
  const json = { data: base64Data };

  // Convert the JSON object to a string
  const jsonString = JSON.stringify(json);

  console.log("===== dataToBasicBufer =====", buf.toString(), buf, jsonString);
  //output {"data":"AQID"}
}

function utf8Decode(buffer) {
  const decoder = new TextDecoder("utf-8");
  console.log("===utf8Decode===", decoder, decoder.decode(buffer));
  return decoder.decode(buffer);
}
function asciiDecode(uint8Array) {
  const decoedr = String.fromCharCode.apply(null, uint8Array);
  console.log("====asciiDecode ====", decoedr);
}

// Function to handle custom event
function handleCustomEvent(payload, websocket) {
  // Process payload
  console.log("Custom event received:", payload);

  // Send response back to client if needed
  websocket.send(
    JSON.stringify({
      type: "SERVER_COORDS_MESSAGE",
      payload: payload,
    })
  );
}

// Create a WebSocket server attached to the HTTP server
function websocketConnection(httpserver) {
  const wss = new WebSocket.Server({ server: httpserver });

  // Handle WebSocket connections
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected.");

    ws.on("open", (e) => {
      ws.send("server websocketr is ready to send message");
    });

    ws.on("message", (message) => {
      console.log(`Received message from client: ${message}`);
      // Process the message received from the WebSocket client
      // You can broadcast this message to all connected WebSocket clients if needed
  
      // Check for custom events
      console.log("line : 100000 -- 165", message)
      // const data = JSON.parse(message);
      // if (data.type === "SEND_COORDS") {
      //   // Handle custom event
      //   handleCustomEvent(message, ws);
      // }
      handleCustomEvent(message, ws);
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
      // console.log("gps daat =============== ", data);
      // dataToBasicBufer(data);
      // utf8Decode(data);
      // asciiDecode(data);
      const gpsData = data.toString("utf8"); // Convert the binary data to a string.
      const res = gpsDataFunc(gpsData);
      console.log(res);
      // Process the data received from the TCP client

      if (res.data !== null) {
        // Forward data to WebSocket clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(res.data);
          }
        });
      }
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
