const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('./api/swagger/swagger-ui');
const swaggerParser = require('./api/swagger/parser');
const app = express();
const port = process.env.PORT || 3000;
const useragent = require('express-useragent');
const log = new (require('/var/lib/core/js/log'))(module);
const scheduler = require('./vendor/scheduler');

const swaggerConfig = {
  appRoot: __dirname,
  swaggerSecurityHandlers: {
    User: require('./middleware/authentication')
  }
};
let server;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.options('/*', (req, res) => {
  /* istanbul ignore next */
  res.header('Access-Control-Allow-Origin', '*');
  /* istanbul ignore next */
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  /* istanbul ignore next */
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  /* istanbul ignore next */
  res.sendStatus(200);
});

app.use(multer({ dest: './uploads/' }).any());

app.enable('trust proxy');

app.use('/public', express.static('public'));


/* istanbul ignore next */
function initScheduler() {
  return scheduler.init()
  .then(() => log.message('Scheduled jobs loaded', {}, 'App'));
}

/* istanbul ignore next */
function initServer() {
  return swaggerParser.getJson('./api/swagger/swagger.yaml')
  .then(schema => {
    swaggerConfig.swagger = schema;

    return new Promise((resolve, reject) => {
      SwaggerExpress.create(swaggerConfig, (err, swaggerExpress) => {
        if (err) {
          log.error(err);
          return reject(err);
        }

        app.use(useragent.express());
        app.use(bodyParser.json());
        app.use(require('./middleware/log'));

        swaggerExpress.register(app);

        swaggerExpress.runner.on('responseValidationError', function(validationResponse, request) {
          log.error('Response validation error', request.guid, validationResponse.errors);
        });

        server = app.listen(port);

        log.message(`Server listening on port ${port}`, {}, 'App');

        if (process.env.NODE_ENV !== 'production') {
          swaggerUi(app, schema);
        }

        return resolve();
      });
    });
  });
}

/* istanbul ignore next */
function shutdown() {
  server.forceShutdown = () => {
    return new Promise(resolve => {

      server.close(() => {

        return resolve();
      });
    });
  };

  return Promise.resolve()
  .then(() => server.forceShutdown())
  .then(() => log.message('Shutdown completed', {}, 'App'))
  .catch(err => log.error(err, '', { message: 'Shutdown error' }));
}

/* istanbul ignore next */
const initPromise = Promise.resolve()
.then(() => initServer())
.then(() => initScheduler())
.catch(err => {
  log.error(err, '', { message: 'Unable to initialize server' });
  /* eslint no-process-exit: 0 */
  shutdown().then(() => process.exit(1));
});

module.exports = {
  initPromise,
  shutdown,
  server
};
