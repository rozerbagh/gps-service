const port = process.env.PORT || 8800;
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");

console.log("server is running on port : " + port);
const server = http.createServer(app);
const io = new Server(server, {
  // options
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  },
});

io.on("connection", (socket) => {
  // ...
  console.log(":::: wss has been connected ::::", socket);
  io.sockets.emit("hi", "everyone");
  io.sockets.emit("data", (data) => {
    console.log(data);
  });
  io.sockets.emit("message", (data) => {
    console.log(data);
  });
  io.sockets.emit("pool", (data) => {
    console.log(data);
  });
  io.sockets.emit("Pool", (data) => {
    console.log(data);
  });
});
io.on("new_namespace", (namespace) => {
  console.log(namespace.name);
});

server.listen(port);
// webSocketServer.listen(8800);
