const BaseProducer = require('/var/lib/core/js/kafka/base-producer');

class UserProducer extends BaseProducer {
  constructor() {
    super('user');
  }
}

module.exports = new UserProducer();
