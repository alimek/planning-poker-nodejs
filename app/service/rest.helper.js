var _ = require('lodash');

module.exports = {
  generateOptions: (url) => {
    return {
      url: url,
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    }
  },
  responseToJson: (response) => {
    return _.isUndefined(response) ? null : JSON.parse(response);
  }
};
