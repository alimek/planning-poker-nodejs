var server = require('http').createServer();
var io = require('socket.io')(server);
var amqp = require('amqp');
var config = require('./app/config');

console.log(config);

var connection = amqp.createConnection(config.rabbitConfig);

connection.on('ready', setup);

//2 define the exchange
var exchange;
function setup() {
    exchange = connection.exchange('my_exchange1', {'type': 'fanout', durable: false}, exchangeSetup);
}

//3 define the queue
var queue;
var deadQueue;
function exchangeSetup() {
    queue = connection.queue('my_queue1', {durable: false, exclusive: true},queueSetup);
    deadQueue = connection.queue('my_queue2', {durable: false, exclusive: true},queueSetup);
    queue.on('queueBindOk', function() { onQueueReady(exchange); });
}

//4 subscribe on queue and bind exchange and q
function queueSetup() {
    queue.subscribe(function(msg) {
        console.log("msg from q is: "+msg.data);

        //TODO
    });
    queue.bind(exchange.name, 'my_queue1');
}

function onQueueReady(exchange){
    exchange.publish('my_queue1', {data:"test"});
}

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

