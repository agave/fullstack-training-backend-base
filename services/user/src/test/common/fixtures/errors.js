const sequelizeError = (field, message) => {
  return {
    errors: [ {
      path: field,
      message: message
    } ]
  };
};

module.exports = {
  sequelizeError,
  commonError: sequelizeError('this field', 'isn\'t valid'),
  notEmptyError: (field) => {
    return sequelizeError(field, 'Validation notEmpty failed');
  },
  invalidValueError: (field) => {
    return sequelizeError(field, 'Validation isIn failed');
  },
  notFound: (model) => {
    return sequelizeError(model, 'Not found');
  }
};
