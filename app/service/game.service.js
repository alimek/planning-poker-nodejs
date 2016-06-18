var request = require('request-promise');
var _ = require('lodash');

var config = require('../config');

var generateOptions = (url) => {
  return {
    url: url,
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

var responseToJson = (response) => {
  return _.isUndefined(response) ? null : JSON.parse(response);
};

module.exports = () => {

  /**
   * @constructor
   */
  function GameService() {
    var service = this;

    service.getGame = getGame;
    service.startGame = startGame;

    /**
     * @param {string} gameID
     * @returns {Promise}
     */
    function getGame(gameID) {
      var options = generateOptions(config.apiURL + '/games/' + gameID);
      return request(options).then(responseToJson);
    }

    /**
     * @param {string} gameID
     * @returns {Promise}
     */
    function startGame(gameID) {
      var options = generateOptions(config.apiURL + '/games/' + gameID + '/start');
      _.extend(options, {
        method: 'PATCH'
      });
      return request(options).then(responseToJson());
    }
  }

  return new GameService();
};
