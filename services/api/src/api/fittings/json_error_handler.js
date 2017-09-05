const util = require('util');
const errorHelper = require('../helpers/error');
const log = new (require('/var/lib/core/js/log'))(module);

function getPath(error, validationError) {
  const { code, params, path } = validationError;
  const objectPath = path.join('.');
  const codes = [ 'ENUM_MISMATCH', 'MINIMUM', 'MAX_LENGTH', 'MIN_LENGTH' ];

  if (error.in === 'query' || error.in === 'path' || error.in === 'formData') {
    return error.name;
  }
  if (codes.indexOf(code) > -1) {
    return objectPath;
  }

  if (objectPath !== '' && params[0]) {
    return objectPath + '.' + params[0];
  }

  return params[0] ? params[0] : objectPath;
}

module.exports = function create() {

  return function error_handler(context, next) {

    if (!util.isError(context.error)) {
      return next();
    }

    const contextError = context.error;
    const request = context.request;

    delete context.error;
    context.headers['Content-Type'] = 'application/json';
    context.statusCode = 200;

    if (contextError.message.includes('formData')) {
      const dataType = request.swagger.params.data_type && request.swagger.params.data_type.value;
      const error = {
        path: 'files',
        message: 'files cannot be null'
      };
      const response = errorHelper.format(dataType, error, true);

      log.error(contextError, context.request.guid, response);

      return next(null, JSON.stringify(response));
    }

    if (contextError.message.includes('Unauthorized')) {
      const dataType = contextError.message === 'Unauthorized' ? 'Session' : 'Role';
      const error = {
        path: 'user',
        message: 'Unauthorized'
      };
      const response = errorHelper.format(dataType, error);

      log.error(contextError, context.request.guid, response);

      return next(null, JSON.stringify(response));
    }

    if (contextError.message.includes('Suspended')) {
      const dataType = 'Role';
      const error = {
        path: 'user',
        message: contextError.message
      };
      const response = errorHelper.format(dataType, error);

      log.error(contextError, context.request.guid, response);

      return next(null, JSON.stringify(response));
    }

    try {
      const dataType = request.swagger.params.data_type && request.swagger.params.data_type.value || 'InvalidRequest';
      const validationError = contextError.errors[0].errors[0];
      const path = getPath(contextError.errors[0], validationError);
      const error = {
        path,
        message: validationError.message
      };
      const response = errorHelper.format(dataType, error, true);

      log.error(contextError, request.guid, response);

      return next(null, JSON.stringify(response));
    } catch (e) {
      // Catch internal errors not related to validations
      const dataType = 'Server';
      const error = {
        message: 'Internal server error'
      };
      const response = errorHelper.format(dataType, error);

      log.error(contextError, request.guid, e);

      return next(null, JSON.stringify(response));
    }
  };
};
