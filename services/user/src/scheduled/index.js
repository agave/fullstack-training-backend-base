const transactionsMonitor = require('./transactions-monitor');

/* istanbul ignore next */
module.exports = {
  '0 0 1 * * *': transactionsMonitor
};
