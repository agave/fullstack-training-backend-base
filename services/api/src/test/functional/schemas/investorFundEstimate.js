const fundEstimateSchema = {
  required: true,
  type: 'object',
  properties: {
    total: {
      required: true,
      type: 'number'
    },
    earnings: {
      required: true,
      type: 'number'
    },
    commission: {
      required: true,
      type: 'number'
    },
    perception: {
      required: true,
      type: 'number'
    },
    isr: {
      required: true,
      type: 'number'
    },
    include_isr: {
      required: true,
      type: 'boolean'
    }
  },
  additionalProperties: false
};

module.exports = fundEstimateSchema;
