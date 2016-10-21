const debug = require('debug')('poker');

const onDisconnect = (socket) => () => {
  debug(`Socket ${socket.id} has been disconnected`);
};

module.exports = {
  onDisconnect
};