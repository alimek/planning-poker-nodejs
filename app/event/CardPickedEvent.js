class CardPickedEvent {
  constructor({
    game,
    player,
    task
  }) {
    this.game = game;
    this.player = player;
    this.task = task;
  }
}

module.exports = CardPickedEvent;