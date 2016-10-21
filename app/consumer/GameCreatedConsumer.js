const debug = require('debug')('poker');

const GameCreatedEvent = require('../event/GameCreatedEvent');

class GameCreatedConsumer {
  constructor(io, rabbitConnection) {
    this.io = io;
    this.connection = rabbitConnection;

    this.init();
  }

  init() {
    this
      .connection
      .then((rabbit) => {
        const client = rabbit.socket('SUB', { noCreate: true });
        client.connect('game', 'game.created', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
              const game = new GameCreatedEvent(JSON.parse(data.toString()));
              debug(`Game created`, game);
          });
        });
      });
  }
}

module.exports = GameCreatedConsumer;