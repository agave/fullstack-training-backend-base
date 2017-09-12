const errorHandler = require('../helpers/error');
const { User } = require('../../models');

class SessionController {
  login({ request }, callback) {

    const { email, password, guid } = request;
    const query = {
      where: {
        email,
        password
      }
    };
    let token = '';


    return User.findOne(query).then(user => {

      if (!user) {
        const error = {
          errors: [ {
            path: 'email or password',
            message: 'email or password does not exists'
          } ]
        };

        return Promise.reject(error);
      }

      token = '1234asdf';

      const response = {
        token,
        email
      };

      return callback(null, response);
    }).catch(err => errorHandler.format(err, guid, callback));
  }
}

module.exports = new SessionController();
