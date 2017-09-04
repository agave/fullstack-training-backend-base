const { eventsWaitTime } = require('../../../config/config').tests;

module.exports = function() {
  return function() {
    return new Promise(resolve => setTimeout(resolve, eventsWaitTime));
  };
};
