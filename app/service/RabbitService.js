var config = require('../config');
var Promise = require('bluebird');

class RabbitService {
  constructor(rabbitConnection) {
    this.connection = this.init(rabbitConnection);
  }

  init(rabbitConnection) {
    return new Promise((resolve, reject) => rabbitConnection.on('ready', () => resolve(rabbitConnection)));
  }
}

module.exports = (rabbitConnection) => {
  return new RabbitService(rabbitConnection);
};