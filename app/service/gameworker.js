const _ = require('lodash');

const GameModel = require('../models/Game');
const UserModel = require('../models/User');
const GameService = require('./game.service')();
const TaskService = require('./task.service')();

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
      
      sub.connect('game', 'game.started', () => {
        sub.setEncoding('utf8');
        sub.on('data', (data) => {
          try {
            data = JSON.parse(data);
            var game = _.find(games, data.id);
            game.startGame();
            game.emit('game-started', true);
          } catch (e) {
            console.log(e);
          }
        });
      });

      io.on('connection', (socket) => {
        socket.on('game', onJoinedToGame);
        socket.on('card-picked', onCardPicked);
        socket.on('player-updated', onPlayerUpdated);
        socket.on('add-task', onTaskAdded);
        socket.on('start-game', startGame);
        socket.on('disconnect', onDisconnect);

        /**
         * @param {object} connectionToGame
         */
        function onJoinedToGame(connectionToGame) {
          var game;

          fetchGame(connectionToGame.gameID)
            .then((_game) => {
              game = _game;

              prepareGameAndSocket(game, socket, connectionToGame.user);
              socket.join('game-' + connectionToGame.gameID);
              emitToGameRoom(socket, 'new-player', socket.user.serialize());
            });
        }

        /**
         * @param {string} value
         */
        function onCardPicked(value) {
          var game = socket.game;
          value = parseInt(value);
          socket.user.pickCard(value);
          emitToGameRoom(socket, 'player-ready', socket.user.id);

          game.update();
          if (game.taskFinished) {
            emitToGameRoom(socket, 'task-finished', game.calculateCurrentTaskPoints());
          }
        }

        /**
         * @param user
         */
        function onPlayerUpdated(user) {
          socket.user.name = user.name;
          emitToGameRoom(socket, 'player-updated', socket.user.serialize());
        }

        function onDisconnect() {
          if (!_.isUndefined(socket.game)) {
            emitToGameRoom(socket, 'player-leaved', socket.user.id);
            socket.game.removeSocket(socket);
          }
        }

        /**
         * @param {string} gameID
         */
        function startGame(gameID) {
          GameService
            .startGame(gameID)
            .then(handleSuccess, handleFailed);

          function handleSuccess() {
            var game = findGameById(gameID);

            if (!_.isUndefined(game)) {
              game.emit('game-started', true);
            }
          }

          /**
           * @param {object} response
           */
          function handleFailed(response) {
            //TODO: when failed staring game
            console.log('failed', response);
          }
        }

        /**
         * @param {object} task
         */
        function onTaskAdded(task) {
          var game = _.find(games, {id: task.gameID});
          TaskService
            .addTask(game, task.name)
            .then(handleSuccess, handleFailed);

          /**
           * @param {object} _task
           */
          function handleSuccess(_task) {
            game.addTask(task.name);
            emitToAllInGame(socket, 'task-added', _task);
          }

          /**
           * @param {object} response
           */
          function handleFailed(response) {
            //TODO: handle failed adding task
            console.log('failed', response);
          }
        }
      });

      /**
       * @param {GameModel} game
       * @param {object} task
       */
      function publishNewTask(game, task) {
        pub.connect('task', () => {
          pub.publish('task.created', JSON.stringify({
            game: game.id,
            task: task
          }));
        });
      }
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

  /**
   * @param {Socket} socket
   * @param {string} event
   * @param {*} data
   */
  function emitToAllInGame(socket, event, data) {
    io.to('game-' + socket.game.id).emit(event, data);
  }

  /**
   * @param {string} gameID
   * @return {GameModel|undefined}
   */
  function findGameById(gameID) {
    return _.find(games, {id: gameID});
  }
};
