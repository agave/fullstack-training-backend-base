const env = process.env.NODE_ENV || 'development';
let kafkaConsumerGroup = 'notification-consumer-service';
let kafkaOffsetReset = 'earliest';

if (env === 'test' || env === 'development') {
  // Avoid group restabilization to improve consumer initialization time
  kafkaConsumerGroup = kafkaConsumerGroup + Math.random();
  // Avoid reprocessing messages when running tests and in development mode
  kafkaOffsetReset = 'latest';
}

const config = {
  env,
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  webBaseUrl: process.env.WEB_BASE_URL || 'http://localhost:4000',
  aws: {
    keyId: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    ses: {
      region: process.env.SES_REGION,
      apiVersion: '2010-12-01',
      sendingRate: 5,
      sender: process.env.SES_SENDER
    }
  },
  kafkaProducer: {
    'client.id': 'notification-producer-service',
    'metadata.broker.list': `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
    'compression.codec': 'snappy',
    'retry.backoff.ms': 200,
    'message.send.max.retries': 10,
    'socket.keepalive.enable': true,
    'queue.buffering.max.messages': 100000,
    'queue.buffering.max.ms': 1000,
    'batch.num.messages': 1000000,
    'dr_cb': true,
    'event_cb': true,
    // debug: 'all',
    topic: 'user'
  },
  kafkaConsumer: {
    'group.id': kafkaConsumerGroup,
    'metadata.broker.list': `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
    'enable.auto.commit': false,
    'event_cb': true,
    // debug: 'all',
    'offsetReset': kafkaOffsetReset,
    'maxMessages': 10,
    topics: [ 'user' ]
  },
  tests: {
    eventsWaitTime: 4000
  }
};

module.exports = config;
