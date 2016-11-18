class GameStartedEvent {
  constructor({
    id,
    name,
    status
  }) {
    this.id = id;
    this.name = name;
    this.status = status;
  }
}

module.exports = GameStartedEvent;