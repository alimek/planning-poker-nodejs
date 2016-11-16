const debug = require('debug')('poker');

const GameCreatedEvent = require('../event/GameCreatedEvent');

class GameCreatedConsumer {
  constructor(io, rabbitConnection) {
    this.io = io;
    this.connection = rabbitConnection;

    this.init();
  }

  init() {
    var self = this;
    this
      .connection
      .then((rabbit) => {
        const client = rabbit.socket('SUB', {noCreate: true});
        client.connect('poker', 'game.created', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const game = new GameCreatedEvent(JSON.parse(data.toString()));
            self.io.in(`game-${game.id}`).emit('game.created', game);
            debug(`Game created`, game);
          });
        });
      });
  }
}

module.exports = GameCreatedConsumer;