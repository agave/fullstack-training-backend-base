class SessionFactory {

  createCredential(email, password) {
    return {
      email,
      password
    };
  }
}

module.exports = new SessionFactory();
