const { apiCommonError } = require('../../../common/fixtures/error');
const guid = 'a62ca90f-854e-4227-aa28-81487d94c4f4';
const token = 'FsRCWfsmBEFxpsGy';
const response = {
  send: () => {
    return;
  }
};
const user = {
  id: 1,
  name: 'Fondeo',
  email: 'test@fondeo.com',
  company: {
    rfc: 'FODA900806965'
  }
};
const simpleUser = {
  name: 'name',
  email: 'email',
  role: 'type'
};
const roles = [
  {
    name: 'Cuentas por cobrar',
    value: 'CXC'
  },
  {
    name: 'Cuentas por pagar',
    value: 'CXP'
  }
];
const passwordValues = {
  actual_password: 'current password',
  new_password: 'new super secret password',
  confirmation_password: 'new super secret password'
};
const passwordConfirmationError = {
  path: 'password_confirmation',
  message: 'password_confirmation is different'
};
const confirmationPasswordError = {
  path: 'confirmation_password',
  message: 'confirmation_password is different'
};

module.exports = {
  getInvitation: {
    request: {
      guid,
      swagger: {
        params: {
          token: {
            value: token
          }
        }
      }
    },
    response,
    user,
    messageCall: 'Get invitation',
    responseType: 'response',
    guid,
    sendParams: [ 'user', 'getInvitation', {
      guid,
      token
    } ],
    responseData: {
      type: 'User',
      data: user
    },
    responseError: {
      type: 'User',
      error: apiCommonError
    },
    errorHelperParams: [
      'User',
      apiCommonError,
      guid,
      response
    ]
  },
  registration: {
    request: {
      guid,
      swagger: {
        params: {
          token: {
            value: token
          }
        }
      },
      body: {
        name: 'name',
        password: '123456',
        password_confirmation: '123456'
      }
    },
    invalidRequest: {
      guid,
      swagger: {
        params: {
          token: {
            value: token
          }
        }
      },
      body: {
        name: 'name',
        password: '123456',
        password_confirmation: '123'
      }
    },
    response,
    sendParams: [ 'user', 'registration', {
      guid,
      token,
      name: 'name',
      password: '123456'
    } ],
    user: simpleUser,
    guid,
    messageCall: 'Registration',
    responseType: 'response',
    responseData: {
      type: 'User',
      data: simpleUser
    },
    responseError: {
      type: 'User',
      error: apiCommonError
    },
    errorHelperParams: [
      'User',
      apiCommonError,
      guid,
      response
    ],
    passwordConfirmationErrorHelperParams: [
      'User',
      passwordConfirmationError,
      guid,
      response
    ]
  },
  getRoles: {
    request: {
      guid
    },
    response,
    roles: {
      roles: roles
    },
    messageCall: 'Get user roles',
    responseType: 'response',
    guid,
    sendParams: [ 'user', 'getRoles', {
      guid
    } ],
    responseData: {
      type: 'UserRoles',
      data: roles
    },
    responseError: {
      type: 'UserRoles',
      error: apiCommonError
    },
    errorHelperParams: [
      'UserRoles',
      apiCommonError,
      guid,
      response
    ]
  },
  delete: {
    request: {
      guid,
      swagger: {
        params: {
          email: {
            value: user.email
          }
        }
      }
    },
    response,
    sendParams: [ 'user', 'delete', {
      guid,
      email: user.email
    } ],
    user: simpleUser,
    guid,
    messageCall: 'Delete user',
    responseType: 'response',
    responseData: {
      type: 'User',
      data: simpleUser
    },
    responseError: {
      type: 'User',
      error: apiCommonError
    },
    errorHelperParams: [
      'User',
      apiCommonError,
      guid,
      response
    ]
  },
  resendInvitation: {
    request: {
      guid,
      swagger: {
        params: {
          email: {
            value: user.email
          }
        }
      }
    },
    response,
    sendParams: [ 'user', 'resendInvitation', {
      guid,
      email: user.email
    } ],
    guid,
    messageCall: 'Resend invitation',
    responseType: 'response',
    responseData: {
      type: 'User',
      data: {
        success: true
      }
    },
    responseError: {
      type: 'User',
      error: apiCommonError
    },
    errorHelperParams: [
      'User',
      apiCommonError,
      guid,
      response
    ]
  },
  changePassword: {
    request: {
      guid,
      user: {
        user_id: user.id
      },
      body: {
        actual_password: passwordValues.actual_password,
        new_password: passwordValues.new_password,
        confirmation_password: passwordValues.confirmation_password
      }
    },
    response,
    sendParams: [ 'user', 'changePassword', {
      guid,
      user_id: user.id,
      actual_password: passwordValues.actual_password,
      new_password: passwordValues.new_password
    } ],
    guid,
    user,
    messageCall: 'Change password',
    responseType: 'response',
    responseData: {
      type: 'User',
      data: user
    },
    responseError: {
      type: 'User',
      error: apiCommonError
    },
    errorHelperParams: [
      'User',
      apiCommonError,
      guid,
      response
    ],
    passwordConfirmationErrorHelperParams: [
      'User',
      confirmationPasswordError,
      guid,
      response
    ]
  },
  recoverPassword: {
    request: {
      guid,
      body: {
        email: user.email
      }
    },
    response,
    sendParams: [ 'user', 'generatePasswordToken', {
      guid,
      email: user.email
    } ],
    guid,
    messageCall: 'Recover password',
    responseType: 'response',
    responseData: {
      type: 'User',
      data: {
        success: true
      }
    },
    responseError: {
      type: 'User',
      error: apiCommonError
    },
    errorHelperParams: [
      'User',
      apiCommonError,
      guid,
      response
    ]
  },
  validateRecoverToken: {
    request: {
      guid,
      query: {
        token
      }
    },
    response,
    sendParams: [ 'user', 'validateRecoverToken', {
      guid,
      token
    } ],
    guid,
    messageCall: 'Validate recover token',
    responseType: 'response',
    responseData: {
      type: 'User',
      data: {
        token,
        email: user.email
      }
    },
    validToken: {
      token,
      email: user.email
    },
    responseError: {
      type: 'User',
      error: apiCommonError
    },
    errorHelperParams: [
      'User',
      apiCommonError,
      guid,
      response
    ]
  },
  resetPassword: {
    request: {
      guid,
      body: {
        password: '123456',
        confirmation_password: '123456'
      },
      swagger: {
        params: {
          token: {
            value: token
          }
        }
      }
    },
    invalidRequest: {
      guid,
      swagger: {
        params: {
          token: {
            value: token
          }
        }
      },
      body: {
        password: '123456',
        confirmation_password: '123'
      }
    },
    response,
    guid,
    user,
    sendParams: [ 'user', 'resetPassword', {
      guid,
      token,
      password: '123456'
    } ],
    messageCall: 'Reset password',
    responseType: 'response',
    responseData: {
      type: 'User',
      data: user
    },
    responseError: {
      type: 'User',
      error: apiCommonError
    },
    errorHelperParams: [
      'User',
      apiCommonError,
      guid,
      response
    ],
    passwordConfirmationErrorHelperParams: [
      'User',
      confirmationPasswordError,
      guid,
      response
    ]
  }
};
