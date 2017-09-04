const factory = require('../factories/user');
const guid = 'a62ca90f-854e-4227-aa28-81487d94c4f4';

class InvitationFixtures {
  validInvitation() {
    return factory.createInvitation('token', 'new user', 'daniel@agavelab.com');
  }

  guid() {
    return guid;
  }
}

module.exports = new InvitationFixtures();
