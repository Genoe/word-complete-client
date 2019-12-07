import openSocket from 'socket.io-client';

let socket;

// In chatroom.js, the method passed in adds the received message to the chat.
// If that's all the event needs to do, it can go here
export function subscribeToChat(cb) {
  socket.on('chat message', msg => cb(null, msg));
}

// establish a connection with the server
export function subscribeToMatchingService(cb) {
  socket = openSocket({
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      }
    }
  });

  socket.on('pending', msg => cb(null, msg));

  socket.on('error', msg => console.log(JSON.stringify(msg)));
}

export function emitMessage(msg, cb) {
  socket.emit('chat message', msg);

  cb();
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

export function subscribeToBadWord(cb) {
  socket.on('bad word', msg => cb(null, msg));
}

// server informs the game is over. Disconnect and allow the player to start a new game
export function subscribeToGameOver(cb) {
  socket.on('game over', msg => cb(null, msg));
}

// when the chatroom is unmounted (naviaged away from) then disconnect
export function disconnect() {
  socket.disconnect();
}

export function connectChat() {
  socket.connect();
}
