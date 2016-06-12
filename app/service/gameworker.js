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
        console.log('New connection', socket.id, "\n");
        socket.on('game', (gameID) => {
          console.log(socket.id, 'joined to ', gameID);
          var game = _.find(games, {id: gameID});
          if (_.isUndefined(game)) {
            game = new GameModel(gameID, 'asdf');
            games.push(game);
          }
          socket.game = game;
          game.sockets.push(socket);
          socket.join('game-'+gameID);
        });

        socket.on('disconnect', () => {
            socket.game.removeSocket(socket);
        });
    });
};
