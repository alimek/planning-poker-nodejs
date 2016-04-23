var amqp = require('amqplib');
var config = require('../config');
var open = amqp.connect(config.rabbitConfig.url);

function RabbitService() {
    var vm = this;
    vm.sendToQueue = sendToQueue;
    vm.receiveFromQueue = receiveFromQueue;
    
    function sendToQueue(name, message) {
        return open.then(function(conn) {
            return conn.createChannel();
        }).then(function(ch) {
            return ch.assertQueue(name).then(function(ok) {
                return ch.sendToQueue(name, new Buffer(JSON.stringify(message)));
            });
        }).catch(console.warn);
    }

    function receiveFromQueue(name, callback) {
        return open.then(function(conn) {
            return conn.createChannel();
        }).then(function(ch) {
            return ch.assertQueue(name).then(function(ok) {
                return ch.consume(name, function(msg) {
                    if (msg !== null) {
                        console.log(msg.content.toString());
                        callback(msg);
                        ch.ack(msg);
                    }
                });
            });
        }).catch(console.warn);
    }

}

module.exports = new RabbitService();