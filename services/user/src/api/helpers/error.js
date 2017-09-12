const _ = require('lodash');
const log = new (require('/var/lib/core/js/log'))(module);

class ErrorHelper {
  format(err, guid, callback) {
    log.error(err, guid);

    const error = {
      path: _.isArray(err.errors) ? err.errors[0].path : err.name,
      message: _.isArray(err.errors) ? err.errors[0].message : err.message,
      data: _.isArray(err.errors) ? err.errors[0].data : undefined
    };

    const response = new Error(JSON.stringify(error));

    return Promise.resolve(callback(response));
  }
}

module.exports = new ErrorHelper();
