const port = process.env.PORT || 8800;
const http = require("http");
const { websocketConnection } = require("./socket_server");
const { app, websockets } = require("./app");
const SOCKET_SERVER_PORT = 3003; // Set the port you want to listen on.
const HTTP_SERVER_PORT = 3006;

const httpserver = http.createServer(app);
const socketserver = websocketConnection(httpserver);
websockets(socketserver);
httpserver.listen(HTTP_SERVER_PORT, () => {
  console.log("server is running on port : " + HTTP_SERVER_PORT);
});
socketserver.net.listen(SOCKET_SERVER_PORT, () => {
  console.log(`GPS socket server is listening on port ${SOCKET_SERVER_PORT}`);
});
