var _ = require('lodash');

function Game(_id, _name) {
  this.id = _id;
  this.sockets = [];
  var name = _name;
  
  this.removeSocket = removeSocket;


  function removeSocket(socket) {
    _.remove(this.sockets, socket);
  }
  
  
}

module.exports = Game;
