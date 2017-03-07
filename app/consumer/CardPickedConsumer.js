const debug = require('debug')('poker');

const CardPickedEvent = require('../event/CardPickedEvent');

class GameCreatedConsumer {
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
        const client = rabbit.socket('SUB', {routing: 'topic'});
        client.connect('poker', 'player.cardpicked', () => {
          client.setEncoding('utf8');
          client.on('data', (data) => {
            const card = new CardPickedEvent(JSON.parse(data.toString()));
            self.io.in(`game-${card.game}`).emit('player.cardpicked', card);
            debug(`Card picked`, card);
          });
        });
      });
  }
}

module.exports = GameCreatedConsumer;