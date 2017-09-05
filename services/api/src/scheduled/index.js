const fileCleaner = require('./file-cleaner');

/* istanbul ignore next */
module.exports = {
  '0 0 6 * *': fileCleaner
};
