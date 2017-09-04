const uuid = require('uuid');
const log = new (require('/var/lib/core/js/log'))(module);

function transactionsMonitor() {
  const guid = uuid.v4();

  log.message('Transactions monitor job started', {}, 'Scheduler', guid);

  return Promise.resolve()
  .then(() => log.message('Transactions monitor job finished', { }, 'Scheduler', guid))
  .catch(err => log.error(err, guid, { message: 'Transactions monitor job failed' }));
}

module.exports = transactionsMonitor;
