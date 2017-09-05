module.exports = {
  operationIsAllowed: {
    reqRestrictedOperation: {
      swagger: {
        operation: {
          method: 'post',
          pathObject: {
            path: '/invoices'
          }
        }
      }
    },
    reqUnrestrictedOperation: {
      swagger: {
        operation: {
          method: 'get',
          pathObject: {
            path: '/invoices'
          }
        }
      }
    },
    scope: [
      'CXC',
      'CXP',
      'ADMIN'
    ],
    unauthorizedRoleUser: {
      suspended: false,
      user_role: 'INVESTOR'
    },
    suspendedUser: {
      suspended: true,
      user_role: 'CXC'
    },
    activeUser: {
      suspended: false,
      user_role: 'CXC'
    }
  }
};
