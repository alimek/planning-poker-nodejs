var config = require('../config')
var promise = require('bluebird');

module.exports = (rabbitConnection) => {
  return new RabbitService(rabbitConnection);
};

/**
 * @param {object} rabbitConnection
 * @constructor
 */
function RabbitService(rabbitConnection) {
  var ready = promise.defer();
  var subscriber;
  var publisher;

  this.getSubscriber = getSubscriber;
  this.getPublisher = getPublisher;
  this.isReady = isReady;
  this.setReady = setReady;


  ready = new promise(function (resolve, reject) {
    rabbitConnection.on('ready', () => {
      publisher = rabbitConnection.socket('PUB', {routing: 'topic'});
      subscriber = rabbitConnection.socket('SUB', {routing: 'topic'});
      resolve({
        publisher: publisher,
        subscriber: subscriber
      })
    });
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
   * @returns {object}
   */
  function getSubscriber() {
    return subscriber;
  }

  /**
   * @returns {object}
   */
  function getPublisher() {
    return publisher;
  }

}