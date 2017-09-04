const kafkaProducer = require('../../../vendor/kafka-producer');

class ConsumerHelper {

  setup() {
    return kafkaProducer.connect();
  }

  produce(event) {
    return kafkaProducer.produce(event);
  }

  teardown() {
    return kafkaProducer.disconnect();
  }
}

module.exports = ConsumerHelper;
