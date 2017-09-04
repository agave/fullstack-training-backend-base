const grpc = require('grpc');
const server = new grpc.Server();
const port = process.env.PORT || 50051;

const log = new (require('/var/lib/core/js/log'))(module);
const scheduler = require('./vendor/scheduler');
const kafkaProducer = require('./vendor/kafka-producer');
const protos = [ ];
const protosAndControllers = [];

protos.forEach(proto => {
  const lower = proto.toLowerCase();
  const controller = require('./api/controllers/' + lower);
  let protoInstance = grpc.load('/var/lib/core/protos/user/' + lower + '.proto')[lower];

  protoInstance = protoInstance[proto].service;

  protosAndControllers.push([ protoInstance, controller ]);
});

/* istanbul ignore next */
function waitForServerStart() {
  return new Promise((resolve) => {
    if (server.started) {
      log.message(`Server listening on port ${port}`, {}, 'App');
      return resolve();
    }

    return setTimeout(() => waitForServerStart().then(resolve), 500);
  });
}

/* istanbul ignore next */
function initGRPCServer() {
  protosAndControllers.forEach(protoService => {
    server.addService.apply(server, protoService);
  });
  server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  server.start();

  return waitForServerStart();
}

/* istanbul ignore next */
function shutdown() {
  return Promise.resolve()
  .then(() => server.forceShutdown())
  .then(() => kafkaProducer.disconnect())
  .then(() => log.message('Shutdown completed', {}, 'App'))
  .catch(err => log.error(err, 'App', { message: 'Shutdown error' }));
}


/* istanbul ignore next */
function initKafkaProducer() {
  return kafkaProducer.connect()
  .then(() => log.message('Kafka producer connected', {}, 'App'));
}

/* istanbul ignore next */
function initScheduler() {
  return scheduler.init()
  .then(() => log.message('Scheduled jobs loaded', {}, 'App'));
}


/* istanbul ignore next */
const initPromise = Promise.resolve()
.then(() => initKafkaProducer())
.then(() => initGRPCServer())
.then(() => initScheduler())
.catch(err => {
  log.error(err, 'App', { message: 'Unable to initialize server' });
  /* eslint no-process-exit: 0 */
  shutdown().then(() => process.exit(1));
});

module.exports = {
  initPromise,
  shutdown,
  server
};
