const env = process.env.NODE_ENV || 'development';
let database = process.env.DB_NAME;
const logging = env === 'test' ? false : console.log;

if (env === 'test' || env === 'development') {
  database = env === 'test' ? database + '_test' : database + '_dev';
}

const config = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: database,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: logging,
  seederStorage: 'sequelize',
  kafkaProducer: {
    'client.id': 'user-producer-service',
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
    topic: 'user'
  }
};

module.exports = config;
