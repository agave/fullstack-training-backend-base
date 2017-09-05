function operationIsAllowed(req, scope, user) {
  const { user_role } = user;

  if (scope.indexOf(user_role) === -1) {
    return 'Unauthorized role';
  }

  return null;
}

module.exports = {
  operationIsAllowed
};
