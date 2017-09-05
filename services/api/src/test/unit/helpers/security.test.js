const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const helper = require('../../../api/helpers/security');
const helperFixtures = require('../fixtures/helpers/security');
const assert = chai.assert;

chai.should();

describe('unit/Security helper', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('operationIsAllowed', () => {

    const fixtures = helperFixtures.operationIsAllowed;
    const { reqRestrictedOperation, reqUnrestrictedOperation, scope, unauthorizedRoleUser,
      suspendedUser, activeUser } = fixtures;

    it('should return false if user role is not included in scope', () => {
      const result = helper.operationIsAllowed(reqUnrestrictedOperation, scope, unauthorizedRoleUser);

      return assert.deepEqual(result, 'Unauthorized role');
    });

    it('should return false if user is suspended and operation is restricted', () => {
      const result = helper.operationIsAllowed(reqRestrictedOperation, scope, suspendedUser);

      return assert.deepEqual(result, 'Suspended company role');
    });

    it('should return true if user is suspended but operation is not restricted', () => {
      const result = helper.operationIsAllowed(reqUnrestrictedOperation, scope, suspendedUser);

      return assert.deepEqual(result, null);
    });

    it('should return true if user is not suspended and operation is restricted', () => {
      const result = helper.operationIsAllowed(reqRestrictedOperation, scope, activeUser);

      return assert.deepEqual(result, null);
    });

    it('should return true if user is not suspended and operation is not restricted', () => {
      const result = helper.operationIsAllowed(reqUnrestrictedOperation, scope, activeUser);

      return assert.deepEqual(result, null);
    });
  });
});
