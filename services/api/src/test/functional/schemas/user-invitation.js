const userInvitationSchema = {
  type: 'object',
  required: true,
  properties: {
    name: {
      required: true,
      type: 'string'
    },
    email: {
      required: true,
      type: 'string'
    },
    color: {
      required: true,
      type: 'string'
    },
    company: {
      type: 'object',
      properties: {
        rfc: {
          required: true,
          type: 'string'
        }
      }
    }
  }
};

module.exports = userInvitationSchema;
