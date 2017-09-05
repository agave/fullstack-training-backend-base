const companySchema = require('./invoice').properties;

const investorCompanySchema = {
  required: true,
  type: 'object',
  properties: {
    companySchema,
    taxpayer_type: {
      required: true,
      type: 'string',
      enum: [ 'physical', 'moral' ]
    }
  }
};

module.exports = investorCompanySchema;
