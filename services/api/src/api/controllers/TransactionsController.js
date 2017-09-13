const fakeResponse = require('../helpers/fake-response');

module.exports = {
  getTransactions(req, res) {
    return fakeResponse
    .getSuccessSample(req)
    .then(result => res.send(result));
  }
};
