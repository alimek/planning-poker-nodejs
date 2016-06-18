var request = require('request-promise');
var _ = require('lodash');

var config = require('../config');
var restHelper = require('./rest.helper');

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
      var options = restHelper.generateOptions(config.apiURL + '/games/' + gameID);
      return request(options).then(restHelper.responseToJson);
    }

    /**
     * @param {string} gameID
     * @returns {Promise}
     */
    function startGame(gameID) {
      var options = restHelper.generateOptions(config.apiURL + '/games/' + gameID + '/start');
      _.extend(options, {
        method: 'PATCH'
      });
      return request(options).then(restHelper.responseToJson());
    }
  }

  return new GameService();
};
