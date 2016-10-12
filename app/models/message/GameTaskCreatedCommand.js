
class GameTaskCreatedCommand {
  constructor({ gameId, task}) {
    this.id = gameId;
    this.task = task;
  }
}

module.exports = GameTaskCreatedCommand;