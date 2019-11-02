import openSocket from 'socket.io-client';

const socket = openSocket('http://192.168.2.103:4000'); // TODO: How will this work in production?

// In chatroom.js, the method passed in adds the received message to the chat.
// If that's all the event needs to do, it can go here
export function subscribeToChat(cb) {
  socket.on('chat message', msg => cb(null, msg));
  // socket.emit('chat message', msg);
  // socket.on('pending', msg => cb(null, msg));
}
// TODO: showPendingMsg is not being used yet. However, should it be set up
// where the "please wait" is always shown, and there is another "connected to player" event
// that will give the socketId of the opponent?
export function subscribeToMatchingService(cb) {
  socket.on('pending', msg => cb(null, msg));
}

export function emitMessage(msg) {
  socket.emit('chat message', msg);
}

export function emitUsername(username) {
  socket.emit('username', username);
}

export function subscribeToMatchFound(cb) {
    socket.on('match found', msg => cb(null, msg));
}

export function subscribeToOppDiscnt(cb) {
    socket.on('opponent disconnected', msg => cb(null, msg));
}
