const KafkaConsumer = require('/var/lib/core/js/kafka/consumer-client');
const config = require('../config/config').kafkaConsumer;

module.exports = new KafkaConsumer(config);
