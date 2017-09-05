const KafkaConsumer = require('/var/lib/core/js/kafka/consumer-client');
const consumerConfig = require('../../../config/config').kafkaConsumer;

class BaseConsumerHelper {

  constructor() {

    this.consumedEvents = [];
    this.kafkaConsumer = new KafkaConsumer(consumerConfig);
  }

  setup() {
    return this.kafkaConsumer.connect(this);
  }

  handle(event) {
    this.consumedEvents.push(event);

    return Promise.resolve();
  }

  getNextEvent(retries = 0) {
    return new Promise((resolve, reject) => {

      if (this.consumedEvents.length === 0) {
        if (retries === 5) {
          return reject(new Error('No new events consumed'));
        }

        return setTimeout(() => {
          return this.getNextEvent(retries + 1).then(resolve).catch(reject);
        }, 1000);
      }

      return resolve(this.consumedEvents.shift());
    });
  }

  teardown() {
    return this.kafkaConsumer.disconnect();
  }
}

module.exports = new BaseConsumerHelper();
