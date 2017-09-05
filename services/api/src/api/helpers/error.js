const log = new (require('/var/lib/core/js/log'))(module);
const errorCodes = require('../../config/error-codes');

class ErrorHelper {
  format(type, error, isRequestValidationError) {
    const errorsMap = errorCodes[type];

    if (isRequestValidationError) {
      error.code = errorCodes.Server.InvalidRequest;
    } else if (error.message === 'Not found') {
      error.code = errorCodes.Server.NotFound;
    } else if (!errorsMap || !errorsMap[error.message]) {
      error.code = errorCodes.Server.Unassigned;
    } else {
      error.code = errorsMap[error.message];
    }

    return {
      type,
      error
    };
  }

  handleResponse(type, error, guid, res) {
    return Promise.resolve()
    .then(() => {
      const response = this.format(type, error);

      log.error(error, guid, response);

      return res.send(response);
    });
  }
}

module.exports = new ErrorHelper();
