const scheduler = require('/var/lib/app/node_modules/node-schedule');

class Scheduler {

  constructor(jobs) {
    this.jobs = jobs;
  }

  init() {
    return new Promise((resolve, reject) => {

      try {
        Object.keys(this.jobs).forEach(key => scheduler.scheduleJob(key, this.jobs[key]));
      } catch (e) {
        return reject(e);
      }

      return resolve();
    });
  }
}

module.exports = Scheduler;
