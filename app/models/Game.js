var _ = require('lodash');

/**
 * @param {string} _id
 * @param {string} _name
 * @constructor
 */
function Game(_id, _name) {
  var game = this;

  game.currentTask = null;
  game.taskFinished = false;
  game.id = _id;
  game.sockets = [];
  game.name = _name;
  game.tasks = [];
  
  game.removeSocket = removeSocket;
  game.addTask = addTask;
  game.update = update;
  game.calculateCurrentTaskPoints = calculateCurrentTaskPoints;


  function update() {
    game.taskFinished = false;
    var playersNumber = game.sockets.length;
    var playersNumberWhoPickedCard = 0;

    _.forEach(game.sockets, (player) => {
      if (!_.isUndefined(player.pickedCard)) {
        playersNumberWhoPickedCard++;
      }
    });

    if (playersNumber === playersNumberWhoPickedCard) {
      game.taskFinished = true;
    }
  }

  /**
   * @returns {number}
   */
  function calculateCurrentTaskPoints() {
    var storyPoints = 0;
    _.forEach(game.sockets, (player) => {
      if (player.pickedCard) {
        storyPoints += parseInt(player.pickedCard);
      }
    });

    return storyPoints/game.sockets.length;
  }

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
