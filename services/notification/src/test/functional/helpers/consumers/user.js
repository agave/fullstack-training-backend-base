const ConsumerHelper = require('../consumer');

class UserConsumerHelper extends ConsumerHelper {

  setup() {
    return super.setup();
  }

  teardown() {
    return super.teardown();
  }
}

module.exports = new UserConsumerHelper();
