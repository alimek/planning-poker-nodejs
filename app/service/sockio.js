
var config = require('../config');

function SocketService() {
    var vm = this;
    vm.sendToChannel = sendToChannel;
    vm.receiveMessage = receiveMessage;

    function sendToChannel(channel, message) {
        io.on('connection', function (socket) {
            socket.emit(channel, message);
        });
    }

    function receiveMessage(endpoint, callback) {
        io.on('connection', function (socket) {
            socket.on(endpoint, function(data) {
                callback(endpoint, data);
            });
        });
    }

}

module.exports = new SocketService();