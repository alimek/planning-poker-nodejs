
var messageRouter = require('./app/messageRouter');
var server = require('http').createServer();
var io = require('socket.io')(server);

messageRouter.initRoutes();
server.listen(8080);



