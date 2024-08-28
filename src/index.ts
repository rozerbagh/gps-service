import { createServer, IncomingMessage } from "http";
import WebSocket, { Server } from "ws";
import Applications from "./app";
import { websocketConnection } from "./socket_server";
const {app, websockets} = Applications
const SOCKET_SERVER_PORT = 3005; // Set the port you want to listen on.
const HTTP_SERVER_PORT = 3006;
const httpserver = createServer(app);
const socketserver = websocketConnection(httpserver);
websockets(socketserver);
app.get("/chatevent/stoptrack/:busid/:role", (req, res) => {
  try{
    const { busid, role } = req.params;
    // Trigger a WebSocket event
    const message = `Stop tracking bus ID: ${busid}`;
    socketserver.broadcast(
      JSON.stringify({
        type: "STOP_BUS_EVENT",
        payload: {
          busid: busid,
          role: role,
        },
      })
    ); // Broadcast message to all WebSocket clients
    res.send({
      statusCode: 200,
      response: {
        status: true,
        message: `Broadcasted message: ${message}`,
        data: null,
        error: null,
      },
    });
  } catch (error){
    res.send({
      statusCode: 500,
      response: {
        status: false,
        message: `Internal Server Error`,
        data: null,
        error: null,
      },
    });
  }
});
httpserver.listen(HTTP_SERVER_PORT, () => {
  // console.log("server is running on port : " + HTTP_SERVER_PORT);
});
socketserver.net.listen(SOCKET_SERVER_PORT, () => {
  // console.log(`GPS socket server is listening on port ${SOCKET_SERVER_PORT}`);
});
