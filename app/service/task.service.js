var request = require('request-promise');
var _ = require('lodash');

var restHelper = require('./rest.helper');
var config = require('../config');

module.exports = () => {

  function TaskService() {
    var service = this;

    service.addTask = addTask;

    /**
     *
     * @param {Game} game
     * @param {string} name
     * @returns {*}
     */
    function addTask(game, name) {
      var options = restHelper.generateOptions(config.apiURL + '/games/' + game.id + '/tasks');
      _.extend(options, {
        method: 'POST',
        body: JSON.stringify({
          name: name
        })
      });

      return request(options).then(restHelper.responseToJson);
    }
  }

  return new TaskService();
};