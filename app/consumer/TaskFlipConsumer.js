const debug = require('debug')('poker');

const TaskFlippedEvent = require('../event/TaskFlippedEvent');

class TaskFlipConsumer {
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
        client.connect('poker', 'task.flip', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const event = new TaskFlippedEvent(JSON.parse(data.toString()));
            self.io.in(`game-${event.gameId}`).emit('task.flip', event);
            debug('Task Flipped', event);
          });
        });
      });
  }
}

module.exports = TaskFlipConsumer;