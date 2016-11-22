class PlayerJoinedGameEvent {
  constructor({
    id,
    guid,
    email,
    name,
    game_id
  }) {
    this.id = id;
    this.guid = guid;
    this.email = email;
    this.name = name;
    this.gameId = game_id;
  }
}

module.exports = PlayerJoinedGameEvent;
