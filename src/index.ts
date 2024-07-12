import { createServer } from "http";
import Applications from "./app";
import { websocketConnection } from "./socket_server";
const {app, websockets} = Applications
const SOCKET_SERVER_PORT = 3005; // Set the port you want to listen on.
const HTTP_SERVER_PORT = 3006;
const httpserver = createServer(app);
const socketserver = websocketConnection(httpserver);
websockets(socketserver);
httpserver.listen(HTTP_SERVER_PORT, () => {
  // console.log("server is running on port : " + HTTP_SERVER_PORT);
});
socketserver.net.listen(SOCKET_SERVER_PORT, () => {
  // console.log(`GPS socket server is listening on port ${SOCKET_SERVER_PORT}`);
});
