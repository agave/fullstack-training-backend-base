const errorCodes = require('../../../../config/error-codes');

const validType = Object.keys(errorCodes)[0];
const validMessage = Object.keys(errorCodes[validType])[0];

module.exports = {
  format: {
    invalidRequestParams: [
      validType,
      {
        path: 'email',
        message: validMessage
      },
      true
    ],
    invalidRequestError: {
      type: validType,
      error: {
        path: 'email',
        message: validMessage,
        code: errorCodes.Server.InvalidRequest
      }
    },
    notFoundParams: [
      validType,
      {
        path: 'email',
        message: 'Not found'
      },
      false
    ],
    notFoundError: {
      type: validType,
      error: {
        path: 'email',
        message: 'Not found',
        code: errorCodes.Server.NotFound
      }
    },
    unassignedTypeParams: [
      'Unknown type',
      {
        path: 'email',
        message: validMessage
      },
      false
    ],
    unassignedTypeError: {
      type: 'Unknown type',
      error: {
        path: 'email',
        message: validMessage,
        code: errorCodes.Server.Unassigned
      }
    },
    unassignedMsgParams: [
      validType,
      {
        path: 'email',
        message: 'unknown message'
      },
      false
    ],
    unassignedMsgError: {
      type: validType,
      error: {
        path: 'email',
        message: 'unknown message',
        code: errorCodes.Server.Unassigned
      }
    },
    existingCodeParams: [
      validType,
      {
        path: 'email',
        message: validMessage
      },
      false
    ],
    existingCodeError: {
      type: validType,
      error: {
        path: 'email',
        message: validMessage,
        code: errorCodes[validType][validMessage]
      }
    }
  },
  handleResponse: {
    type: validType,
    error: {
      path: 'email',
      message: validMessage
    },
    guid: 'a62ca90f-854e-4227-aa28-81487d94c4f4',
    response: {
      send: () => {
        return;
      }
    },
    formattedError: {
      type: validType,
      error: {
        path: 'email',
        message: validMessage,
        code: 101
      }
    }
  }
};
