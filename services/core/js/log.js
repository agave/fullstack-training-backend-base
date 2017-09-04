const winston = require('/var/lib/app/node_modules/winston/lib/winston');
const forbiddenFields = require('./forbidden-fields');

function omitDeep(collection, excludeKeys) {

  if (!collection || typeof collection !== 'object') {
    return collection;
  }

  return Object.keys(collection).reduce((result, key) => {

    if (excludeKeys.indexOf(key) === -1 && collection.hasOwnProperty(key)) {
      const value = collection[key];

      if (typeof value === 'object') {
        result[key] = omitDeep(value, excludeKeys);
      } else {
        result[key] = collection[key];
      }
    }

    return result;
  }, {});
}

class Log {
  constructor(module) {
    this.log = new winston.Logger({
      transports: [
        new winston.transports.Console({
          level: 'debug',
          label: this.getFilePath(module),
          handleException: true,
          json: false,
          colorize: true,
          timestamp: true,
          formatter: options => {
            const info = {
              level: options.level.toUpperCase(),
              data: options.meta
            };

            info.data.timestamp = new Date().getTime();

            return JSON.stringify(info);
          }
        })
      ],
      exitOnError: false
    });
  }

  getFilePath(module) {
    return module.filename.split('/').slice(-2).join('/');
  }

  message(msg, data = {}, type = '', guid = '') {

    const cloneData = omitDeep(data, forbiddenFields);

    const obj = {
      guid,
      type,
      msg,
      data: JSON.stringify(cloneData)
    };

    this.log.info(obj);
  }

  error(e, guid = '', data = {}) {

    const cloneData = omitDeep(data, forbiddenFields);

    const obj = {
      guid,
      msg: e.message,
      stack: e.stack,
      error: e,
      data: JSON.stringify(cloneData)
    };

    this.log.error(obj);
  }

  warn(msg, data = {}, guid = '') {

    const cloneData = omitDeep(data, forbiddenFields);

    const obj = {
      guid,
      msg,
      data: JSON.stringify(cloneData)
    };

    this.log.warn(obj);
  }
}

module.exports = Log;
