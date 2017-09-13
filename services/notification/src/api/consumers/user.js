const BaseConsumer = require('/var/lib/core/js/kafka/base-consumer');

class UserConsumer extends BaseConsumer {
  constructor() {
    super('user');
  }

  loginEvent(event) {

    const { value } = event;
    const { body, guid } = value;

    console.log(body, guid);

    return Promise.resolve();
  }
}

module.exports = new UserConsumer();
