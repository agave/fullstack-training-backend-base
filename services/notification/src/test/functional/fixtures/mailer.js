class MailerFixtures {
  valid() {
    return {
      template: 'invitation',
      data: {
        username: 'oscaregerardo'
      },
      email: 'dev@fondeodirecto.com',
      subject: 'HOLA'
    };
  }
  invalidEmail() {
    return {
      template: 'invitation',
      data: {
        username: 'oscaregerardo'
      },
      email: 'dev@;kajdhfkjsad.com',
      subject: 'HOLA'
    };
  }
  nonExistenttemplate() {
    return {
      data: {
        username: 'oscaregerardo'
      },
      email: 'dev@kajdhfkjsad.com',
      subject: 'HOLA'
    };
  }
}

module.exports = new MailerFixtures();
