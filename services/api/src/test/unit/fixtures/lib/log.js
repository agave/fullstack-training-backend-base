const message = 'test';
const data = {
  password: '1234',
  user: {
    id: 3,
    actual_password: '1234'
  },
  other: {
    cfdi: { },
    new_user: {
      id: 15,
      new_password: '123232',
      confirmation_password: '123232',
      test1: {
        test2: {
          value: {
            xml: 'test'
          }
        }
      }
    }
  }
};
const cleanData = JSON.stringify({
  user: {
    id: 3
  },
  other: {
    new_user: {
      id: 15,
      test1: {
        test2: {
          value: {}
        }
      }
    }
  }
});
const type = 'A type';
const error = {
  message: 'Access Denied',
  stack: {
    value: 'test'
  }
};
const guid = 'a62ca90f-854e-4227-aa28-81487d94c4f4';

module.exports = {
  message: {
    message,
    guid,
    type,
    data,
    cleanLog: {
      guid,
      type,
      msg: message,
      data: cleanData
    }
  },
  error: {
    error,
    guid,
    type,
    data,
    cleanLog: {
      guid,
      msg: error.message,
      stack: error.stack,
      error,
      data: cleanData
    }
  },
  warn: {
    message,
    guid,
    type,
    data,
    cleanLog: {
      guid,
      msg: message,
      data: cleanData
    }
  }
};
