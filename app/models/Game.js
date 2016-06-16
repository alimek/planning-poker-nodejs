var _ = require('lodash');

/**
 * @param {string} _id
 * @param {string} _name
 * @constructor
 */
function Game(_id, _name) {
  var game = this;

  game.id = _id;
  game.sockets = [];
  game.name = _name;
  game.tasks = [];
  
  game.removeSocket = removeSocket;
  game.addTask = addTask;


  /**
   * @param {string} name
   */
  function addTask(name) {
    game.tasks.push({name: name});
  }

  /**
   * @param {Socket} socket
   */
  function removeSocket(socket) {
    _.remove(game.sockets, socket);
  }
  
  
}

module.exports = Game;
