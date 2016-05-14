
function SocketIOService(io, rabbitService) {
  io.on('connection', (socket) => {
    console.log('New connection', socket.id);
    socket.on('joinGame', (data) => {
      rabbitService.createGame(data);
    });
  });
}

module.exports = SocketIOService;