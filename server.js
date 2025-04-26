const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

let drawings = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("init", drawings);

  socket.on("draw", (data) => {
    drawings.push(data);
    socket.broadcast.emit("draw", data);
  });

  socket.on("clear", () => {
    drawings = [];
    io.emit("clear");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});