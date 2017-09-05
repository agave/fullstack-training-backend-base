const factory = require('../factories/user');
const tokenFixtures = require('/var/lib/core/integration_fixtures/token');
const userFixtures = require('/var/lib/core/integration_fixtures/user');
const _ = require('lodash');

class UserFixtures {
  validRegistrationToken() {
    const token = _.find(tokenFixtures, { type: 'registration', token: 'validtoken' });

    return token;
  }

  deletableRegistrationToken() {
    const token = _.find(tokenFixtures, { type: 'registration', token: 'deletetoken' });

    return token;
  }

  invalidRegistrationToken() {
    return {
      token: '0355936221',
      email: '0987654321'
    };
  }

  validUser() {
    const user = _.find(userFixtures, { name: 'validuser' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  validAdminUser() {
    return factory.user('admin', '123456', 'dev@fondeodirecto.com');
  }

  validCxcUser() {
    const user = _.find(userFixtures, { name: 'CxcUser' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  suspendedCXCUser() {
    const user = _.find(userFixtures, { name: 'SuspendedCXC' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  validCxpUser() {
    const user = _.find(userFixtures, { name: 'CxpUser' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  validCxpUser2() {
    const user = _.find(userFixtures, { name: 'CpcUser2' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  suspendedCXPUser() {
    const user = _.find(userFixtures, { name: 'SuspendedCXP' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  validInvestorUser() {
    const user = _.find(userFixtures, { name: 'investorUser' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  suspendedInvestorUser() {
    const user = _.find(userFixtures, { name: 'SuspendedINVESTOR' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  validPhysicalInvestorUser() {
    const user = _.find(userFixtures, { name: 'physicalInvestor' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }


  zeroBalanceInvestor() {
    const user = _.find(userFixtures, { name: 'zeroBalanceInvestor' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  invalidUser() {
    return factory.user('unknown', '', 'unknown@fondeodirecto.com');
  }

  deletableUser() {
    const user = _.find(userFixtures, { name: 'deleteuser' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  validResendUser() {
    const user = _.find(userFixtures, { name: 'validuser' });

    return factory.user(user.name, user.decrypted_password, user.email);
  }

  validResendToken() {
    const token = _.find(tokenFixtures, { type: 'registration', token: 'resendToken' });

    return token;
  }

  wrongPasswordConfirmation(reset) {
    let user = _.find(userFixtures, { name: 'ChangePasswordUser' });

    const method = reset ? 'resetPassword' : 'changePassword';
    const params = {
      resetPassword: [
        'asdfqwer1234'
      ],
      changePassword: [
        user.decrypted_password,
        'asdfqwer1234'
      ]
    };

    user = factory[method].apply(null, params[method]);
    user.confirmation_password = 'something else';

    return user;
  }

  wrongActualPassword() {
    return factory.changePassword('not the real password', 'asdfqwer1234');
  }

  validNewPasswordData(reset) {
    const user = _.find(userFixtures, { name: 'ChangePasswordUser' });
    const method = reset ? 'resetPassword' : 'changePassword';
    const params = {
      resetPassword: [
        'asdfqwer1234'
      ],
      changePassword: [
        user.decrypted_password,
        'asdfqwer1234'
      ]
    };

    return factory[method].apply(null, params[method]);
  }

  validChangePasswordUser() {
    return _.find(userFixtures, { name: 'ChangePasswordUser' });
  }

  wrongEmail() {
    return { email: 'anemailthatdoesnotexist@fondeodirecto.com' };
  }

  expiredRecoverPasswordToken() {
    const token = _.find(tokenFixtures, { type: 'recover_password', token: 'expiredPasswordToken' });

    return token;
  }

  validRecoverPasswordToken() {
    const token = _.find(tokenFixtures, { type: 'recover_password', token: 'changePasswordToken' });

    return token;
  }
}

module.exports = new UserFixtures();
