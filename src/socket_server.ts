import net, { Socket } from "net";
import WebSocket, { Server } from "ws";
import { IncomingMessage, Server as HttpServer } from "http";

interface GPSData {
  identifier: string;
  latitude: string;
  longitude: string;
  speed: string;
  date: string;
  time: string;
  fields: string[];
}

interface GPSDataFuncResult {
  data: string;
  error: Error | null;
}

const gpsDataFunc = (gpsData: string): GPSDataFuncResult => {
  try {
    const fields = gpsData.split(",");

    const identifier = fields[1];
    const latitude = fields[5];
    const longitude = fields[7];
    const speed = fields[8];
    const date = fields[3];
    const time = fields[9];

    // console.log("===========================");
    // console.log(`Identifier: ${identifier}`);
    // console.log(`Latitude: ${latitude}`);
    // console.log(`Longitude: ${longitude}`);
    // console.log(`Speed: ${speed}`);
    // console.log(`Date: ${date}`);
    // console.log(`Time: ${time}`);
    // console.log("===========================");

    if (!identifier) {
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
        error: new Error("Undefined identifier"),
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
  } catch (error: any) {
    // console.log(error);
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
      error,
    };
  }
};

function dataToBasicBuffer(params: string): void {
  const buf = Buffer.from(params);
  const base64Data = buf.toString("base64");
  const json = { data: base64Data };
  const jsonString = JSON.stringify(json);

  // console.log("===== dataToBasicBuffer =====", buf.toString(), buf, jsonString);
  // output {"data":"AQID"}
}

function utf8Decode(buffer: Uint8Array): string {
  const decoder = new TextDecoder("utf-8");
  // console.log("===utf8Decode===", decoder, decoder.decode(buffer));
  return decoder.decode(buffer);
}

function asciiDecode(uint8Array: Uint8Array): string {
  const decoder = String.fromCharCode.apply(null, Array.from(uint8Array));
  // console.log("====asciiDecode ====", decoder);
  return decoder;
}

function handleCustomEvent(payload: any, websocket: Server): void {
  // console.log("Custom event received:", payload);
  websocket.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "SERVER_COORDS_MESSAGE",
          payload,
        })
      );
    }
  });
}

function websocketConnection(httpserver: HttpServer): {
  net: net.Server;
  ws: Server;
} {
  const wss = new WebSocket.Server({ server: httpserver });

  wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
    // console.log("WebSocket client connected.");

    ws.on("open", () => {
      ws.send("server websocket is ready to send message");
    });

    ws.on("message", (message: string) => {
      // console.log(`Received message from client: ${message}`);
      let data: any;
      try {
        data = JSON.parse(message);
      } catch (err) {
        // console.log("Error parsing JSON:", err);
        return;
      }

      if (data.type === "SEND_COORDS") {
        handleCustomEvent(data.payload, wss);
      }
    });

    ws.on("close", () => {
      // console.log("WebSocket client disconnected.");
    });

    ws.on("error", (err: Error) => {
      console.error("WebSocket error:", err);
    });
  });

  const socketserver = net.createServer((socket: Socket) => {
    // console.log("GPS tracker connected.");

    socket.on("data", (data: Buffer) => {
      // console.log("GPS data =============== ", data);
      const gpsData = data.toString("utf8");
      const res = gpsDataFunc(gpsData);
      // console.log(res);

      if (res.data !== null) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(res.data);
          }
        });
      }
    });

    socket.on("close", () => {
      // console.log("GPS tracker disconnected.");
    });

    socket.on("error", (err: Error) => {
      console.error("Socket error:", err);
    });
  });

  return { net: socketserver, ws: wss };
}
export { websocketConnection };
