const debug = require('debug')('poker');

const ClientStore = require('../store/ClientStore');
const PlayerDropoutMessage = require('../message/PlayerDropoutMessage');

const onDisconnect = (socket, rabbit) => () => {
  const pub = rabbit.rabbit.socket('PUB', {routing: 'topic', noCreate: true});
  const player = ClientStore.getPlayer(socket.id);
  const playerDropoutMessage = new PlayerDropoutMessage(player.gameID, player.playerID.guid);
  pub.connect('poker', function() {
    pub.publish('player.dropout', JSON.stringify(playerDropoutMessage));
  });

  ClientStore.removePlayer(socket.id);
  socket.in(`game-${player.gameID}`).emit('player.offline', playerDropoutMessage);
  debug(`Socket ${socket.id} has been disconnected`);
};

module.exports = {
  onDisconnect
};