const Logger = require('/var/lib/core/js/log');
const log = new Logger(module);

const consumers = require('./api/consumers');
const kafkaConsumer = require('./vendor/kafka-consumer');

function initKafkaConsumer() {
  return kafkaConsumer.connect(consumers)
  .then(() => log.message('Kafka consumer connected', {}, 'App'));
}

function shutdown() {
  return Promise.resolve()
  .then(() => kafkaConsumer.disconnect())
  .then(() => log.message('Shutdown completed', {}, 'App'))
  .catch(err => log.message(err, '', { msg: 'Shutdown error' }));
}

const initPromise = Promise.resolve()
.then(() => initKafkaConsumer())
.catch(err => {
  log.error(err, '', {
    msg: 'Unable to initialize service'
  });
  /* eslint no-process-exit: 0 */
  shutdown().then(() => process.exit(1));
});

module.exports = {
  initPromise,
  shutdown,
  kafkaConsumer
};
