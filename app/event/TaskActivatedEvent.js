
class TaskActivatedEvent {
  constructor({
    id,
    status,
    game_id,
    votes
  }) {
    this.id = id;
    this.status = status;
    this.gameId = game_id;
    this.votes = votes;
  }
}

module.exports = TaskActivatedEvent;
