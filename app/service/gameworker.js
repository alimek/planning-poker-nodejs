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
                } catch (e) {
                    console.log(e);
                }

                //io.on('connection', (socket) => {
                //    socket.on('game-574035eb9ff152691f0041a7/create', (data) => {
                //
                //        io.on('connection', (socket) => {
                //            io.sockets.emit('game-123/create', { asd: 2 });
                //        });
                //
                //        io.in('game-123').emit('create', 'dasdas');
                //    });
                //});
                //io.on('game-123/join', (data) => {
                //    console.log(data);
                //});
                //io.on('game-123/create', (data) => {
                //    console.log('dupa'+data);
                //});
            });
            //pub.connect('game', () => {
            //    pub.publish('game.create', 'asdada');
            //});

        });
    });

    io.on('connection', (socket) => {
        console.log('New connection', socket.id, "\n");
    });
};
