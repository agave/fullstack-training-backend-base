const factory = require('../factories/session');

class SessionFixtures {
  credential() {
    return factory.createCredential('dev@fondeodirecto.com', '123456');
  }
  invalidCredential() {
    return factory.createCredential('de@fondeodirecto.com', '123456');
  }
  wrongPassword() {
    return factory.createCredential('dev@fondeodirecto.com', '12345');
  }
  withoutEmail() {
    return factory.createCredential(undefined, '12345');
  }
  withoutPassword() {
    return factory.createCredential('dev@fondeodirecto.com', undefined);
  }
}

module.exports = new SessionFixtures();
