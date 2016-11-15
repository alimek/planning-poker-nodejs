const debug = require('debug')('poker');

const GameTaskCreatedEvent = require('../event/GameTaskCreatedEvent');

class TaskCreatedConsumer {
  constructor(io, rabbitConnection) {
    this.io = io;
    this.connection = rabbitConnection;

    this.init();
  }

  init() {
    var that = this;
    this
      .connection
      .then((connection) => {
        const client = connection.socket('SUB', { noCreate: true });
        client.connect('poker', 'task.created', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const event = new GameTaskCreatedEvent(JSON.parse(data.toString()));
            that.io.in(`game-${event.gameId}`).emit('task.created', event);
            debug('Task Created', event);
          });
        });
      });
  }
}

module.exports = TaskCreatedConsumer;