const debug = require('debug')('poker');

const GameStartedEvent = require('../event/GameStartedEvent');

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
        client.connect('game', 'game.started', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const game = new GameStartedEvent(JSON.parse(data.toString()));
            debug(`Game started`, game);
          });
        });
      });
  }
}

module.exports = GameCreatedConsumer;