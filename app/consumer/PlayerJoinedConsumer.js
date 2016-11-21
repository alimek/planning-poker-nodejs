const debug = require('debug')('poker');

const PlayerJoinedGameEvent = require('../event/PlayerJoinedGameEvent');

class PlayerJoinedConsumer {
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
        client.connect('poker', 'player.joined', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const event = new PlayerJoinedGameEvent(JSON.parse(data.toString()));
            self.io.in(`game-${event.gameId}`).emit('player.joined', event);
            debug('User joined', event);
          });
        });
      });
  }
}

module.exports = PlayerJoinedConsumer;