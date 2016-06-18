const _ = require('lodash');
const GameModel = require('../models/Game');
const UserModel = require('../models/User');
const GameService = require('./game.service')();

var games = [];

module.exports = (io, rabbitService) => {
  rabbitService
    .isReady()
    .then((obj) => {
      var sub = obj.subscriber;
      var pub = obj.publisher;

      sub.connect('game', 'game.create', () => {
        var game;

        sub.setEncoding('utf8');
        sub.on('data', (data) => {
          try {
            game = JSON.parse(data);
            console.log('Game created', game.id, "\n");
          } catch (e) {
            console.log(e);
          }
        });
      });

      io.on('connection', (socket) => {
        //TODO: Refactor it
        socket.on('game', (connectionToGame) => {
          var game, players = [];

          fetchGame(connectionToGame.gameID)
            .then((_game) => {
              game = _game;

              prepareGameAndSocket(game, socket, connectionToGame.user);
              socket.join('game-' + connectionToGame.gameID);
              emitToGameRoom(socket, 'new-player', socket.user.serialize());
            });
        });

        socket.on('card-picked', (value) => {
          var game = socket.game;
          value = parseInt(value);
          socket.user.pickCard(value);
          emitToGameRoom(socket, 'player-ready', socket.user.id);

          game.update();
          if (game.taskFinished) {
            emitToGameRoom(socket, 'task-finished', game.calculateCurrentTaskPoints());
          }
        });

        socket.on('player-updated', (user) => {
          socket.user.name = user.name;
          emitToGameRoom(socket, 'player-updated', socket.user.serialize());
        });

        socket.on('task-added', (task) => {
          var game = _.find(games, {id: task.gameID});
          game.addTask(task.name);
          emitToGameRoom(socket, 'task-added', {
            name: task.name
          });
        });

        socket.on('start-game', (gameID) => {
          var game = _.find(games, {id: gameID});
          game.started = true;
          emitToGameRoom(socket, 'game-started', true);
        });

        socket.on('disconnect', () => {
          if (!_.isUndefined(socket.game)) {
            emitToGameRoom(socket, 'player-leaved', socket.user.id);
            socket.game.removeSocket(socket);
          }
        });
      });

    });

  /**
   * @param {GameModel} game
   * @param {Socket} socket
   * @param {object} userData
   */
  function prepareGameAndSocket(game, socket, userData) {
    var players = [];
    _.forEach(game.sockets, (socket) => {
      players.push(socket.user.serialize());
    });

    game.sockets.push(socket);
    socket.emit('players', players);
    socket.emit('tasks', game.tasks);
    socket.game = game;

    socket.user = UserModel.newInstance(userData);
  }

  /**
   * @param {string} gameID
   * @returns {Promise}
   */
  function fetchGame(gameID) {
    var game = _.find(games, {id: gameID});

    if (_.isUndefined(game)) {
      game = new GameModel(gameID);
      games.push(game);
    }

    return GameService
      .getGame(gameID)
      .then((response) => {
        game.updateFromApi(response);

        return game;
      });
  }

  /**
   * @param {Socket} socket
   * @param {string} event
   * @param {*} data
   */
  function emitToGameRoom(socket, event, data) {
    socket.broadcast.to('game-' + socket.game.id).emit(event, data);
  }
};
