import openSocket from 'socket.io-client';

const URL = 'http://192.168.2.103:8081';

const socket = openSocket(URL); // TODO: How will this work in production?

// In chatroom.js, the method passed in adds the received message to the chat.
// If that's all the event needs to do, it can go here
export function subscribeToChat(cb) {
  socket.on('chat message', msg => cb(null, msg));
  // socket.emit('chat message', msg);
  // socket.on('pending', msg => cb(null, msg));
}

// establish a connection with the server
export function subscribeToMatchingService(cb) {
  if (socket.disconnected) {
    socket.connect(URL);
  }

  socket.on('pending', msg => cb(null, msg));
}

// send out a chat message
export function emitMessage(msg) {
  socket.emit('chat message', msg);
}

// send out the username
export function emitUsername(username) {
  socket.emit('username', username);
}

// server will say a match has been found
export function subscribeToMatchFound(cb) {
    socket.on('match found', msg => cb(null, msg));
}

// server will say that the opponent disconnected
export function subscribeToOppDiscnt(cb) {
    socket.on('opponent disconnected', msg => cb(null, msg));
}

// when the chatroom is unmounted (naviaged away from) then disconnect
export function disconnect() {
  socket.disconnect();
}

export function connectChat() {
  socket.connect(URL);
}