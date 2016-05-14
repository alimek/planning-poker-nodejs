var httpServer = require('http').createServer();
var io = require('socket.io')().attach(httpServer);
var rabbitjs = require('rabbit.js');

var config = require('./app/config');
var rabbitConnection = rabbitjs.createContext(config.rabbitConfig.url);
var rabbitService = require('./app/service/rabbit')(rabbitConnection);
var socketService = require('./app/service/sockio')(io, rabbitService);


httpServer.listen(config.wsPort, '0.0.0.0', function () {
  console.log('Server is running on port', config.wsPort);
});