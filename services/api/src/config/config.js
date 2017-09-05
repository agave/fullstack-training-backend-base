const env = process.env.NODE_ENV || 'development';
let kafkaConsumerGroup = 'api-consumer-service';
let kafkaOffsetReset = 'earliest';

if (env === 'test' || env === 'development') {
  // Avoid group restabilization to improve consumer initialization time
  kafkaConsumerGroup = kafkaConsumerGroup + Math.random();
  // Avoid reprocessing messages when running tests
  kafkaOffsetReset = env === 'test' ? 'latest' : kafkaOffsetReset;
}

const config = {
  kafkaConsumer: {
    'group.id': kafkaConsumerGroup,
    'metadata.broker.list': `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
    'enable.auto.commit': false,
    'event_cb': true,
    'offsetReset': kafkaOffsetReset,
    'maxMessages': 10,
    topics: [ 'user' ]
  }
};

module.exports = config;
