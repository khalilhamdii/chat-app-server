const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const http = require('http');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const router = require('./router');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(router);

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    socket.join(user.room);
  });
  socket.on('disconnect', () => {
    console.log('User had left!');
  });
});

server.listen(PORT, () => {
  console.log(`Server has started on port : ${PORT}`);
});
