const httpServer = require('http').createServer();
const io = require('socket.io')().attach(httpServer);
const rabbitjs = require('rabbit.js');

const config = require('./config');
const RabbitConnection = rabbitjs.createContext(config.rabbitConfig.url);
const RabbitService = require('./service/RabbitService')(RabbitConnection);
const SocketService = require('./service/SocketService');

//Run all Consumers
require('./consumer')(io, RabbitService.connection);
new SocketService(io, RabbitService);

httpServer.listen(
  config.wsPort,
  '0.0.0.0',
  () => console.log(`Server is running on port: ${config.wsPort}`)
);
