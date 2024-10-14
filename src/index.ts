import { createServer } from "http";
import Applications from "./app";
import { websocketConnection } from "./socket_server";
import allScoketsRoutes from "./routes/socket.routes";
import logger from "./utils/logs";
const {app, websockets} = Applications
const SOCKET_SERVER_PORT = 3005; // Set the port you want to listen on.
const HTTP_SERVER_PORT = 3006;
const httpserver = createServer(app);
const socketserver = websocketConnection(httpserver);
websockets(socketserver);
const socketRoutes = allScoketsRoutes(socketserver)
app.use("/app/v1/messages", socketRoutes);
app.get("/chatevent/stoptrack/:busid/:role", (req, res) => {
  try{
    const { busid, role } = req.params;
    // Trigger a WebSocket event
    const message = `Stop tracking bus ID: ${busid}`;
    socketserver.broadcast(
      JSON.stringify({
        type: "STOP_BUS_EVENT",
        payload: {
          busid,
          role,
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
  logger.log({
    level: "info",
    message: "server is running on port : " + HTTP_SERVER_PORT
  });
});
socketserver.net.listen(SOCKET_SERVER_PORT, () => {
  logger.log({
    level: "info",
    message: `GPS socket server is listening on port ${SOCKET_SERVER_PORT} _ ${socketserver.net.listening}`,
    date: Date.now(),
  });
});

