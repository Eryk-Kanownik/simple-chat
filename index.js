const express = require("express");
const app = express();

const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

const PORT = 5000 | process.env.PORT;

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

let users = [];

io.on("connection", (socket) => {
  socket.on("new-user", (username) => {
    if (username === "") {
      username = `user${socket.id}`;
    }
    let obj = {
      socketId: socket.id,
      username,
    };
    users.push(obj);
    let messageString = `${username} joined channel!`;
    socket.broadcast.emit("user-joined", messageString);
  });

  socket.on("send-message", (str) => {
    socket.broadcast.emit("incoming-message", str);
  });

  socket.on("disconnect", () => {
    let index = users.map((user) => user.socketId).indexOf(socket.id);
    let messageString = `${users[index]?.username} left channel`;
    socket.broadcast.emit("user-left", messageString);
    users = users.filter((user, i) => i !== index);
  });
});

server.listen(PORT, () =>
  console.log(`Server runs on http://localhost:${PORT}`)
);
