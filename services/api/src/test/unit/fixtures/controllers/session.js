const email = 'dev@fondeodirecto.com';
const password = '123456';
const token = 'FsRCWfsmBEFxpsGy';
const guid = 'a62ca90f-854e-4227-aa28-81487d94c4f4';
const response = {
  send: () => {
    return;
  }
};
const user = {
  id: 1,
  name: 'Fondeo',
  email,
  company: {
    rfc: 'FODA900806965',
    role: 'ADMIN'
  }
};
const sendError = {
  path: 'Session',
  message: 'send error'
};

module.exports = {
  login: {
    request: {
      guid,
      body: {
        email,
        password
      }
    },
    response,
    session: {
      token: {
        token,
        expiration_date: 'today'
      },
      user: {
        id: 1,
        name: 'Fondeo',
        email,
        company: {
          rfc: 'FODA900806965',
          role: 'ADMIN'
        }
      }
    },
    messageCall: 'Login',
    responseType: 'response',
    guid,
    sendParams: [ 'session', 'verifyAndCreate', {
      guid,
      email,
      password
    } ],
    responseData: {
      type: 'Session',
      data: {
        token: {
          token,
          expiration_date: 'today'
        },
        user
      }
    },
    responseError: {
      type: 'Session',
      error: sendError
    },
    errorHelperParams: [
      'Session',
      sendError,
      guid,
      response
    ]
  },
  logout: {
    request: {
      guid,
      user: {
        token
      }
    },
    response,
    session: {
      guid,
      token
    },
    guid,
    responseData: {
      type: 'Session',
      data: {
        success: true
      }
    },
    responseError: {
      type: 'Session',
      error: sendError
    },
    errorHelperParams: [
      'Session',
      sendError,
      guid,
      response
    ],
    sendParams: [ 'session', 'deleteToken', {
      guid,
      token
    } ],
    messageCall: 'Logout',
    responseType: 'response'
  }
};
