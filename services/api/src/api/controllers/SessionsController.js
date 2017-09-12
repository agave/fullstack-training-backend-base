const gateway = require('../helpers/gateway');
const errorHelper = require('../helpers/error');

module.exports = {
  login(req, res) {

    const credentials = {
      guid: req.guid,
      email: req.body.email,
      password: req.body.password
    };

    return gateway.sendUser('session', 'login', credentials).then( user => {

      const response = {
        type: 'Session',
        data: user
      };

      return res.send(response);
    }).catch(error => errorHelper.handleResponse('Session', error, req.guid, res));
  }
};
