var request = require('request-promise');

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
  return JSON.parse(response);
};

module.exports = () => {

  /**
   * @constructor
   */
  function GameService() {
    var service = this;

    service.getGame = getGame;

    function getGame(gameID) {
      var options = generateOptions(config.apiURL + '/games/' + gameID);
      return request(options).then(responseToJson);
    }
  }

  return new GameService();
};
