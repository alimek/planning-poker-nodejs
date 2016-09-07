var _ = require('lodash');

/**
 * @param {string} _id
 * @constructor
 */
function Game(_id) {
  var game = this;

  game.currentTask = null;
  game.taskFinished = false;
  game.id = _id;
  game.sockets = [];
  game.name = null;
  game.tasks = [];
  game.status = null;
  
  game.removeSocket = removeSocket;
  game.addTask = addTask;
  game.update = update;
  game.calculateCurrentTaskPoints = calculateCurrentTaskPoints;
  game.updateFromApi = updateFromApi;
  game.startGame = startGame;
  game.emit = emit;
  game.serialize = serialize;

  function serialize() {
    return {
      id: game.id,
      status: game.status,
      tasks: game.tasks
    };
  }

  /**
   * @param {string} eventName
   * @param {*} data
   */
  function emit(eventName, data) {
    _.forEach(game.sockets, (socket) => {
      socket.emit(eventName, data);
    });
  }

  function startGame() {
    game.started = true;
  }

  /**
   * @param {object} responseData
   */
  function updateFromApi(responseData) {
    game.name = responseData.name;
    game.tasks = responseData.tasks;
    game.status = responseData.status;
  }


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
