class PlayerDropoutMessage {
  constructor(
    gameID,
    playerID
  ) {
    this.gameID = gameID;
    this.playerID = playerID;
  }
}

module.exports = PlayerDropoutMessage;