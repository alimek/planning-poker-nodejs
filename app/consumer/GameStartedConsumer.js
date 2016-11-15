const debug = require('debug')('poker');

const GameStartedEvent = require('../event/GameStartedEvent');

class GameStartedConsumer {
  constructor(io, rabbitConnection) {
    this.io = io;
    this.connection = rabbitConnection;

    this.init();
  }

  init() {
    var that = this;
    this
      .connection
      .then((rabbit) => {
        const client = rabbit.socket('SUB', {noCreate: true});
        client.connect('poker', 'game.started', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const game = new GameStartedEvent(JSON.parse(data.toString()));
            that.io.in(`game-${game.id}`).emit('game.started', game);
            debug(`Game started`, game);
          });
        });
      });
  }
}

module.exports = GameStartedConsumer;