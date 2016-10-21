const debug = require('debug')('poker');

const GameTaskCreatedEvent = require('../event/GameTaskCreatedEvent');

class TaskCreatedConsumer {
  constructor(io, rabbitConnection) {
    this.io = io;
    this.connection = rabbitConnection;

    this.init();
  }

  init() {
    this
      .connection
      .then((connection) => {
        const client = connection.socket('SUB', { noCreate: true });
        client.connect('game', 'game.task.created', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const event = new GameTaskCreatedEvent(JSON.parse(data.toString()));

            debug('Task Created', event);
          });
        });
      });
  }
}

module.exports = TaskCreatedConsumer;