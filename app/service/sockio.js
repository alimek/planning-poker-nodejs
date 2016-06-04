module.exports = (io, rabbitService) => {
  io.on('connection', (socket) => {
    socket.on('joinGame', (data) => {
      rabbitService.createGame(data);
    });
  });
};
