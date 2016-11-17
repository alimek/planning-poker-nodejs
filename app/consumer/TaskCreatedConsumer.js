const debug = require('debug')('poker');

const GameTaskCreatedEvent = require('../event/GameTaskCreatedEvent');

class TaskCreatedConsumer {
  constructor(io, rabbitConnection) {
    this.io = io;
    this.connection = rabbitConnection;

    this.init();
  }

  init() {
    const self = this;
    this
      .connection
      .then((rabbit) => {
        const client = rabbit.socket('SUB', { noCreate: true });
        client.connect('poker', 'task.created', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const event = new GameTaskCreatedEvent(JSON.parse(data.toString()));
            self.io.in(`game-${event.gameId}`).emit('task.created', event);
            debug('Task Created', event);
          });
        });
      });
  }
}

module.exports = TaskCreatedConsumer;