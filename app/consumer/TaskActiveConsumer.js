const debug = require('debug')('poker');

const TaskActivatedEvent = require('../event/TaskActivatedEvent');

class TaskActiveConsumer {
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
        const client = rabbit.socket('SUB', { routing: 'topic' });
        client.connect('poker', 'task.active', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const event = new TaskActivatedEvent(JSON.parse(data.toString()));
            self.io.in(`game-${event.gameId}`).emit('task.active', event);
            debug('Task Activated', event);
          });
        });
      });
  }
}

module.exports = TaskActiveConsumer;