var config = require('../config');

module.exports = (rabbitConnection) => {
  return new RabbitService(rabbitConnection);
};

/**
 * @param {object} rabbitConnection
 * @constructor
 */
function RabbitService(rabbitConnection) {
  var ready;

  this.createGame = createGame;
  this.isReady = isReady;
  this.setReady = setReady;

  rabbitConnection.on('ready', () => {
    this.publisher = rabbitConnection.socket('PUB');
    this.subscriber = rabbitConnection.socket('SUB');

    ready = true;
  });

  /**
   * @returns {boolean}
   */
  function isReady() {
    return ready;
  }

  /**
   * @param {boolean} _ready
   */
  function setReady(_ready) {
    ready = _ready;
  }
  
  /**
   * @param {object} obj
   */
  function createGame(obj) {
    var publisher = this.publisher;

    if (ready) {
      publisher.connect('gameCreated', () => {
        console.log('Wysyłam do rabbita', obj);
        publisher.write(JSON.stringify(obj));
      });
    }
  }
}