const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const gateway = require('../api/helpers/gateway');
const { operationIsAllowed } = require('../api/helpers/security');

passport.use(new Strategy(
  function(token, done) {
    /* istanbul ignore next */
    return gateway.sendUser('session', 'checkToken', { token })
    .then(user => {
      return Promise.resolve(done(null, user));
    })
    .catch(() => {
      return Promise.resolve(done(new Error('Unauthorized')));
    });
  }
));

module.exports = function(req, definition, scopes, next) {
  const request = req;
  const scope = Object.keys(req.swagger.operation.securityDefinitions);

  scope.forEach((part, index, array) => {
    array[index] = array[index].toUpperCase();
  });

  passport.authenticate('bearer', { session: false }, (err, user) => {
    if (err || !user) {
      return next(new Error(err ? err.message : 'Unauthorized'));
    }

    const messageError = operationIsAllowed(req, scope, user);

    if (messageError) {
      return next(new Error(messageError));
    }

    request.user = user;

    return next();
  })(req);
};
