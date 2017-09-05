class UserFactory {

  user(name, password, email) {
    return {
      name,
      password,
      password_confirmation: password,
      email
    };
  }

  changePassword(password, new_password) {
    return {
      actual_password: password,
      new_password: new_password,
      confirmation_password: new_password
    };
  }

  resetPassword(password) {
    return {
      password,
      confirmation_password: password
    };
  }
}

module.exports = new UserFactory();
