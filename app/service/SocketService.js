const GameActions = require('../actions/GameActions');
const UserActions = require('../actions/UserActions');

class SocketService {
  constructor(io) {
    io.on('connection', (socket) => {
      socket.on('join', GameActions.onJoinedGame(socket));
      socket.on('disconnect', UserActions.onDisconnect(socket));
    });
  }
}

module.exports = SocketService;