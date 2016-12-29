const debug = require('debug')('poker');

const GameMessage = require('../message/GameMessage');

const ClientStore = require('../store/ClientStore');
const PlayerGame = require('../model/PlayerGame');

const onJoinedGame = (socket) => (data) => {
  const message = new GameMessage(data);
  
  socket.join(`game-${message.id}`);
  
  const playerGame = new PlayerGame(message.id, message.user, socket.id);
  ClientStore.addPlayer(playerGame);

  debug(`Socket ${socket.id} joined to game ${message.id}`);
};

module.exports = {
  onJoinedGame
};