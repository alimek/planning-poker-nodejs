class GameStartedEvent {
  constructor({
    game
  }) {
    this.game = game;
  }
}

module.exports = GameStartedEvent;