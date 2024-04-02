const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const { Vector3 } = require("three");
const app = express();
const server = http.createServer(app);
const playerPositions = {};

app.get("/", (req, res) => {
  res.send("Hello express!!!");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    mathods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  io.emit("update_positions", playerPositions);

  socket.on("send_message", (data) => {
    playerPositions[socket.id] = data;
    io.emit("update_positions", playerPositions);
  });

  socket.on("disconnect", () => {
    delete playerPositions[socket.id];
    console.log(`Player disconnected: ${socket.id}`);
  });
});

server.listen(4000);
