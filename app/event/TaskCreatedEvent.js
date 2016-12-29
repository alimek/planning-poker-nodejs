
class TaskCreatedEvent {
  constructor({
    id,
    name,
    status,
    game_id
  }) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.gameId = game_id;
  }
}

module.exports = TaskCreatedEvent;
