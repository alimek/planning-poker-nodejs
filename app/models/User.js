var _ = require('lodash');

/**
 * @param {string} _id
 * @param {string} _name
 * @constructor
 */
function User(_id, _name) {
  var user = this;

  user.isReady = false;
  user.pickedCard = null;
  user.id = _id;
  user.name = _name;

  user.serialize = serialize;
  user.pickCard = pickCard;


  /**
   * @param {string|number} value
   */
  function pickCard(value) {
    user.pickedCard = parseInt(value);
    user.isReady = true;
  }

  /**
   * @returns {object}
   */
  function serialize() {
    return {
      id: user.id,
      name: user.name,
      isReady: user.isReady,
      pickedCard: null
    };
  }
}

User.newInstance = newInstance;

/**
 * @param {object} data
 * @return {User}
 */
function newInstance(data) {
  return new User(data.id, data.name);
}

module.exports = User;
