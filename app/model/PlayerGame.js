class PlayerGame {
  constructor(
    gameID,
    playerID,
    socketID
  ) {
    this.gameID = gameID;
    this.playerID = playerID;
    this.socketID = socketID;
  }
}

module.exports = PlayerGame;