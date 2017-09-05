const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const API = require('../helpers/api');
const validate = require('../helpers/validate');
const consumer = require('../helpers/consumer');

const errorCodes = require('../../../config/error-codes');
const fixtures = require('../fixtures/user');

const simpleUserSchema = require('../schemas/simple-user');
const userInvitationSchema = require('../schemas/user-invitation');
const userRegistrationSchema = require('../schemas/user-registration');
const userRolesSchema = require('../schemas/user-roles');
const deletedUserSchema = require('../schemas/deleted-user');
const errorSchema = require('../schemas/error');
const successSchema = require('../schemas/success');
const invitationResendSchema = require('../schemas/events/invitation-resend');
const passwordChangedSchema = require('../schemas/events/password-changed');
const recoverPasswordSchema = require('../schemas/events/recover-password');
const sessionSchema = require('../schemas/session');
const tokenSchema = require('../schemas/token');

chai.should();
chai.use(chaiAsPromised);

describe('functional/User tests', function() {

  beforeEach(() => {
    if (!API.isLoggedIn()) {
      return API.login();
    }

    return Promise.resolve();
  });

  describe('getInvitation', function() {

    it('should not return error if not authenticated', function() {
      return API.logout()
      .then(() => API.getInvitation(fixtures.validRegistrationToken().token))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return validate(userInvitationSchema)(responseData.data);
      });
    });

    it('should return error if token is invalid', function() {
      return API.getInvitation(fixtures.invalidRegistrationToken().token)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return invitation successfully', function() {
      return API.getInvitation(fixtures.validRegistrationToken().token)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return validate(userInvitationSchema)(responseData.data);
      });
    });
  });

  describe('registration', () => {

    it('should not return a Session error if not authenticated', function() {

      const data = fixtures.validUser();
      const token = fixtures.invalidRegistrationToken().token;

      return API.logout()
      .then(() => API.registration(data, token))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if password_confirmation is different', () => {

      const data = fixtures.validUser();
      const token = fixtures.invalidRegistrationToken().token;

      data.password_confirmation = '123';

      return API.registration(data, token)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        responseData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if token doesn\'t exists', () => {

      const data = fixtures.validUser();
      const token = fixtures.invalidRegistrationToken().token;

      return API.registration(data, token)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return a success response', () => {

      const data = fixtures.validUser();
      const token = fixtures.validRegistrationToken().token;

      return API.registration(data, token)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return validate(userRegistrationSchema)(responseData.data);
      });
    });
  });

  describe('getRoles', function() {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.getUserRoles())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getUserRoles())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getUserRoles())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getUserRoles())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return roles successfully', function() {
      return API.getUserRoles()
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('UserRoles');
        return validate(userRolesSchema)(responseData.data);
      });
    });
  });

  describe('delete', function() {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.deleteUser({}))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.deleteUser({}))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.deleteUser({}))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.deleteUser({}))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if email is not present', function() {
      return API.deleteUser({})
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if user does not exist', function() {
      return API.deleteUser(fixtures.invalidUser().email)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    // TODO: verify that user is actually deleted once we have a
    // getUser endpoint
    it('should return deleted user successfully', function() {
      return API.deleteUser(fixtures.deletableUser().email)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return validate(deletedUserSchema)(responseData.data);
      });
    });

    it('should return error if you are trying to delete the last user', function() {
      return API.deleteUser(fixtures.validUser().email)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.code.should.be.eql(errorCodes.User[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return deleted invitation successfully', function() {
      const token = fixtures.deletableRegistrationToken();

      return API.deleteUser(token.email)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return validate(deletedUserSchema)(responseData.data);
      })
      .then(() => API.getInvitation(token.token))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        return validate(errorSchema)(errorData.error);
      });
    });
  });

  describe('resendInvitation', function() {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.resendInvitation({}))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.resendInvitation({}))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.resendInvitation({}))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.resendInvitation({}))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if user does not exist', function() {
      return API.resendInvitation(fixtures.invalidRegistrationToken().email)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a successful response', function() {
      return API.resendInvitation(fixtures.validResendToken().email)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return consumer.getNextEvent()
        .then(validate(invitationResendSchema))
        .then(validate(successSchema)(responseData));
      });
    });
  });

  describe('changePassword', function() {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.changePassword({}))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the passsword and password confirmation doesn\'t match', function() {
      const validUser = fixtures.validChangePasswordUser();
      const data = {
        email: validUser.email,
        password: validUser.decrypted_password
      };
      const wrongConfirmation = fixtures.wrongPasswordConfirmation();

      return API.logout()
      .then(() => API.login(data))
      .then(() => API.changePassword(wrongConfirmation))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.path.should.be.eql('confirmation_password');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if the actual passsword is incorrect', function() {
      const wrongPassword = fixtures.wrongActualPassword();

      return API.changePassword(wrongPassword)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a successful response', function() {
      const validNewPassword = fixtures.validNewPasswordData();

      return API.changePassword(validNewPassword)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return consumer.getNextEvent()
        .then(validate(passwordChangedSchema))
        .then(validate(simpleUserSchema)(responseData.data));
      }).then(() => {

        return API.logout();
      }).then(() => {
        const validUser = fixtures.validChangePasswordUser().email;

        const data = {
          email: validUser,
          password: validNewPassword.new_password
        };

        return API.login(data);
      }).then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('Session');
        return validate(sessionSchema)(responseData.data);
      });
    });
  });

  describe('recoverPassword', function() {

    it('should return a success if the email doesn\'t exists', function() {
      const wrongEmail = fixtures.wrongEmail();

      return API.logout()
      .then(() => API.recoverPassword(wrongEmail))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return validate(successSchema)(responseData);
      });
    });

    it('should return a successful response', function() {
      const validEmail = {
        email: fixtures.validChangePasswordUser().email
      };

      return API.logout()
      .then(() => API.recoverPassword(validEmail))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return consumer.getNextEvent()
        .then(validate(recoverPasswordSchema))
        .then(validate(successSchema)(responseData));
      });
    });
  });

  describe('validateRecoverToken', function() {

    it('should return an error if the token doesn\'t exists', function() {
      const wrongToken = fixtures.validRegistrationToken().token;

      return API.logout()
      .then(() => API.validateRecoverToken(wrongToken))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.path.should.be.eql('token');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the token has expired', function() {
      const expiredToken = fixtures.expiredRecoverPasswordToken().token;

      return API.logout()
      .then(() => API.validateRecoverToken(expiredToken))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.path.should.be.eql('token');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a successful response', function() {
      const validToken = fixtures.validRecoverPasswordToken().token;

      return API.logout()
      .then(() => API.validateRecoverToken(validToken))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return validate(tokenSchema)(responseData.data);
      });
    });
  });

  describe('resetPassword', function() {

    it('should return an error if the token doesn\'t exists', function() {
      const wrongToken = fixtures.validRegistrationToken().token;
      const passwordData = fixtures.validNewPasswordData(true);

      return API.logout()
      .then(() => API.resetPassword(wrongToken, passwordData))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.path.should.be.eql('token');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the token has expired', function() {
      const expiredToken = fixtures.expiredRecoverPasswordToken().token;
      const passwordData = fixtures.validNewPasswordData(true);

      return API.logout()
      .then(() => API.resetPassword(expiredToken, passwordData))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.path.should.be.eql('token');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the password and confirmation doesn\'t match', function() {
      const validToken = fixtures.validRecoverPasswordToken().token;
      const passwordData = fixtures.wrongPasswordConfirmation(true);

      return API.logout()
      .then(() => API.resetPassword(validToken, passwordData))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('User');
        errorData.error.path.should.be.eql('confirmation_password');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a successful response', function() {
      const validToken = fixtures.validRecoverPasswordToken().token;
      const passwordData = fixtures.validNewPasswordData(true);

      return API.logout()
      .then(() => API.resetPassword(validToken, passwordData))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('User');
        return consumer.getNextEvent()
        .then(validate(passwordChangedSchema))
        .then(validate(simpleUserSchema)(responseData.data));
      }).then(() => {

        return API.logout();
      }).then(() => {
        const validUser = fixtures.validRecoverPasswordToken().email;

        const data = {
          email: validUser,
          password: passwordData.password
        };

        return API.login(data);
      }).then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.eql('Session');
        return validate(sessionSchema)(responseData.data);
      });
    });
  });
});
