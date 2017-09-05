const jsf = require('json-schema-faker');

/* istanbul ignore next */
module.exports.getSuccessSample = function(req) {
  const responseSchema = req.swagger.operation.getResponse(200).schema;
  const schema = {
    type: responseSchema.type,
    required: [ 'type', 'data' ],
    properties: {
      type: responseSchema.properties.type,
      data: responseSchema.properties.data
    }
  };

  return jsf.resolve(schema)
  .then((result) => {
    return { type: result.type, data: result.data };
  });
};

/* istanbul ignore next */
module.exports.getErrorSample = function(req) {
  const responseSchema = req.swagger.operation.getResponse(200).schema;
  const schema = {
    type: responseSchema.type,
    required: [ 'type', 'error' ],
    properties: {
      type: responseSchema.properties.type,
      error: responseSchema.properties.error
    }
  };

  return jsf.resolve(schema)
  .then((result) => {
    return { type: result.type, error: result.error };
  });
};
