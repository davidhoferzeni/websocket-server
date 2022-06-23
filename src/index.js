//import:
const express = require('express');
const seqGen = require('./modules/utility/seqGen');
const arrOps = require('./modules/utility/arrOps');

const app = express();

const port = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('src/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('hi');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chatMessage', (msg) => {
    console.log(`user sent: ${msg}`);
    io.emit('chatMessage', msg);
  });

  socket.on('switchRoom', function(newroom){
    // leave the current room (stored in session)
    socket.leave(socket.room);
    // join new room, received as function parameter
    socket.join(newroom);
    socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
    // sent message to OLD room
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
    // update socket session room title
    socket.room = newroom;
    socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
    socket.emit('updaterooms', rooms, newroom);
  });

});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

console.time('Create Room List');
console.time('Create All Sequences');
const sequenceList = seqGen.fixSeqList(4, seqGen.cs.uc());
console.timeEnd('Create All Sequences');
console.time('Shuffle List');
const roomList = arrOps.shuffle(sequenceList);
console.timeEnd('Shuffle List');
console.time('Logging List');
console.log(roomList);
console.timeEnd('Logging List');
console.timeEnd('Create Room List');