const _ = require('lodash');
const GameModel = require('../models/Game');

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
        console.log('New connection', socket.id, "\n");
        socket.on('game', (connectionToGame) => {
          var gameID = connectionToGame.gameID;
          var user = connectionToGame.user;
          var game = _.find(games, {id: gameID});
          var players = [];

          console.log(socket.id, '-', user.name , 'joined to ', gameID);

          if (_.isUndefined(game)) {
            game = new GameModel(gameID, 'asdf');
            games.push(game);
          } else {
            _.forEach(game.sockets, (player) => {
              players.push(player.user);
            });
          }

          socket.game = game;
          socket.user = user;
          game.sockets.push(socket);
          socket.join('game-'+gameID);


          socket.emit('players', players);
          socket.broadcast.to('game-'+gameID).emit('new-player', user);
        });

        socket.on('disconnect', () => {
          if (!_.isUndefined(socket.game)) {
            socket.broadcast.to('game-'+socket.game.id).emit('player-leaved', socket.user.id);
            socket.game.removeSocket(socket);
          }
        });
    });
};
