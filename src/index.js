const express = require('express');
const app = express();

//const port = process.env.PORT || 3000
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('hi');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log(`user sent: ${msg}`);
    io.emit('chat message', msg);
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});