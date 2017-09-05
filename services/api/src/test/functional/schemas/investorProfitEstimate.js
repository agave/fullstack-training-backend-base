const fundEstimateSchema = {
  required: true,
  type: 'object',
  properties: {
    gain: {
      required: true,
      type: 'number'
    },
    gain_percentage: {
      required: true,
      type: 'number'
    },
    annual_gain: {
      required: true,
      type: 'number'
    }
  },
  additionalProperties: false
};

module.exports = fundEstimateSchema;
