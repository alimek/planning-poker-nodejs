
class GameTaskCreatedEvent {
  constructor({
    id,
    name
  }) {
    this.id = id;
    this.name = name;
  }
}

module.exports = GameTaskCreatedEvent;