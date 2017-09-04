const BaseConsumer = require('/var/lib/core/js/kafka/base-consumer');

class UserConsumer extends BaseConsumer {
  constructor() {
    super('user');
  }
}

module.exports = new UserConsumer();
