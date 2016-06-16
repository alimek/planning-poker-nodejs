const _ = require('lodash');
const GameModel = require('../models/Game');
const UserModel = require('../models/User');

var games = [];

module.exports = (io, rabbitService) => {
    rabbitService.isReady().then(function (obj) {
        var sub = obj.subscriber;
        //var pub = obj.publisher;

        sub.connect('game', 'game.create', () => {
            var game;

            sub.setEncoding('utf8');
            sub.on('data', function (data) {
                try {
                    game = JSON.parse(data);
                    console.log('Game created', game.id, "\n");
                    io.in('game-'+ game.id).emit(JSON.stringify({'foo': 'barr'}));
                } catch (e) {
                    console.log(e);
                }

            });
        });
    });

    io.on('connection', (socket) => {
        //TODO: Refactor it
        socket.on('game', (connectionToGame) => {
          var gameID = connectionToGame.gameID;
          var user = connectionToGame.user;
          var game = _.find(games, {id: gameID});
          var players = [];

          if (_.isUndefined(game)) {
            game = new GameModel(gameID, 'asdf');
            games.push(game);
          } else {
            _.forEach(game.sockets, (socket) => {
              players.push(socket.user.serialize());
            });
          }

          socket.game = game;
          socket.user = UserModel.newInstance(user);
          game.sockets.push(socket);
          socket.join('game-'+gameID);


          socket.emit('players', players);
          socket.emit('tasks', game.tasks);
          socket.broadcast.to('game-'+gameID).emit('new-player', socket.user.serialize());
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

        socket.on('disconnect', () => {
          if (!_.isUndefined(socket.game)) {
            emitToGameRoom(socket, 'player-leaved', socket.user.id);
            socket.game.removeSocket(socket);
          }
        });
    });

  /**
   * @param {Socket} socket
   * @param {string} event
   * @param {*} data
   */
  function emitToGameRoom(socket, event, data) {
    socket.broadcast.to('game-' + socket.game.id).emit(event, data);
  }
};
