const fs = require('fs');

module.exports = (io, RabbitConnection) => {
  fs
    .readdirSync(__dirname)
    .forEach((file) => {
      if (file.indexOf('Consumer.js') !== -1) {
        const Class = require(`./${file}`);

        new Class(io, RabbitConnection);
      }
    });
};
