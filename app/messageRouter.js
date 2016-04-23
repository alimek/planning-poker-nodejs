var Rabbit = require('./service/rabbit');
var SockIO = require('./service/sockio');
//var routes = require('./routesConfig');

function MessageRouter() {
    var vm = this;
    vm.initRoutes = initRoutes;

    function initRoutes() {
        /*for(route in routes.messageRoutes.rabbitToSockio) {
            Rabbit.receiveFromQueue(route.)
        }
        for(route in routes.messageRoutes.sockioToRabbit) {

        }*/
        Rabbit.receiveFromQueue('game.status', receiveGameStatusMessage);
        SockIO.receiveMessage('gameStatus', receivedGameJoinCall);
    }

    function receivedGameJoinCall(message) {
        Rabbit.sendToQueue('game.join', message);
    }

    function receiveGameStatusMessage(message) {
        SockIO.sendToChannel(message.gameId, message);
    }
}


//example calls to test
Rabbit.sendToQueue("game.status", {message: "gameJoin", gameId: 12421});
Rabbit.sendToQueue("game.status", {message: "gameJoin", gameId: 12421});


module.exports = new MessageRouter();