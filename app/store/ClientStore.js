
const PlayerGame = require('../model/PlayerGame');

class ClientStore {

  constructor() {
    this.playerList = [];
  }

  addPlayer(playerGame) {
    const playerIndex = this.playerList.findIndex((curValue) => {
      return curValue.playerID.guid === playerGame.playerID.guid && curValue.gameID === playerGame.gameID;
    });
    if (playerIndex === -1) {
      this.playerList.push(playerGame);
    } else {
      this.playerList[playerIndex].socketID = playerGame.socketID;
    }
  }

  getPlayer(socketID) {
    return this.playerList.find((curValue) => {
      return curValue.socketID === socketID;
    });
  }

  removePlayer(socketID) {

    const playerIndex = this.playerList.findIndex((curValue) => {
      return curValue.socketID === socketID;
    });

    this.playerList.splice(playerIndex, 1);
  }

}

module.exports = new ClientStore();