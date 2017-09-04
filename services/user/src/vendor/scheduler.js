const Scheduler = require('/var/lib/core/js/scheduler');
const jobs = require('../scheduled');

module.exports = new Scheduler(jobs);
