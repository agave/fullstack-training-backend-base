const kafkaProducer = require('/var/lib/app/vendor/kafka-producer');
const ProducerDownError = new Error('Producer is disconnected');

class BaseProducer {
  constructor(topic) {
    this.topic = topic;
  }

  ensureConnection() {
    return new Promise((resolve, reject) => {
      if (!kafkaProducer.isConnected()) {
        return reject(ProducerDownError);
      }

      return resolve();
    });
  }

  produce(event) {
    event.topic = this.topic;

    return kafkaProducer.produce(event);
  }
}

module.exports = BaseProducer;
