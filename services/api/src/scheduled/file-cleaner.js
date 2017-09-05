const uuid = require('uuid');
const utils = require('../api/helpers/utils');
const log = new (require('/var/lib/core/js/log'))(module);

/* istanbul ignore next */
function fileCleaner() {
  const guid = uuid.v4();

  log.message('File cleaner job started', {}, 'Scheduler', guid);

  return utils.readDir('../uploads/').then(files => {

    const tasks = [];

    files.forEach(file => {
      tasks.push(utils.unlink('../uploads/' + file));
    });

    return Promise.all(tasks);
  })
  .then(() => log.message('File cleaner job finished', {}, 'Scheduler', guid))
  .catch(err => log.error(err, guid, { message: 'File cleaner job failed' }));
}

module.exports = fileCleaner;
