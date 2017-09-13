const errorHandler = require('../helpers/error');
const { User } = require('../../models');
const { userProducer } = require('../producers');

class SessionController {
  login({ request }, callback) {

    const { email, password, guid } = request;
    const response = { };


    return userProducer.ensureConnection().then(() => {
      const query = {
        where: {
          email,
          password
        }
      };

      return User.findOne(query);
    }).then(user => {

      if (!user) {
        const error = {
          errors: [ {
            path: 'email or password',
            message: 'email or password does not exists'
          } ]
        };

        return Promise.reject(error);
      }

      response.token = '1234asdf';
      response.email = email;

      return userProducer.loginEvent(response, guid);
    }).then(() => {

      return callback(null, response);
    }).catch(err => errorHandler.format(err, guid, callback));
  }
}

module.exports = new SessionController();
