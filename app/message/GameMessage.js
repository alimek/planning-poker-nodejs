class GameMessage {
  constructor({
    gameID,
    user
  }) {
    this.id = gameID;
    this.user = user;
  }
}

module.exports = GameMessage;