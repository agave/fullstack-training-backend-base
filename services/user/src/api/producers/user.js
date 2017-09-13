const BaseProducer = require('/var/lib/core/js/kafka/base-producer');

class UserProducer extends BaseProducer {
  constructor() {
    super('user');
  }

  loginEvent(user, guid) {
    const event = {
      message: {
        type: 'LoginEvent',
        body: {
          token: user.token,
          email: user.email
        },
        guid
      },
      key: user.token
    };

    return this.produce(event);
  }
}

module.exports = new UserProducer();
