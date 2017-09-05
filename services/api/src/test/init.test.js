const consumer = require('./functional/helpers/consumer');
const app = require('../app');

before(() => Promise.all([ app.initPromise, consumer.setup() ]));

after(() => Promise.all([ app.shutdown(), consumer.teardown() ]));
