
class GameTaskCreatedEvent {
  constructor({
    id,
    name,
    game_id
  }) {
    this.id = id;
    this.name = name;
    this.gameId = game_id;
  }
}

module.exports = GameTaskCreatedEvent;