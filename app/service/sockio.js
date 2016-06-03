
function SocketIOService(io, rabbitService) {
  io.on('connection', (socket) => {
    socket.on('joinGame', (data) => {
      rabbitService.createGame(data);
    });
  });
}

module.exports = SocketIOService;