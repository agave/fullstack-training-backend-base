const KafkaProducer = require('/var/lib/core/js/kafka/producer-client');
const config = require('../config/config').kafkaProducer;

module.exports = new KafkaProducer(config);
