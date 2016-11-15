const debug = require('debug')('poker');

const TaskMessage = require('../message/TaskMessage');

const onTaskCreated = (socket) => (data) => {
  const message = new TaskMessage(data);

  socket.join(`game-${message.id}`);
  debug(`Socket ${socket.id} joined to game ${message.id}`);
};