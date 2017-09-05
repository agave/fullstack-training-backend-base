const log = new (require('/var/lib/core/js/log'))(module);
const forbiddenFields = require('/var/lib/core/js/forbidden-fields');
const uuid = require('uuid');
const _ = require('lodash');

module.exports = (req, res, next) => {

  return new Promise((resolve, reject) =>{
    try {
      const guid = uuid.v4();
      const dataReceived = {
        params: _.cloneDeep(req.params),
        body: _.cloneDeep(req.body),
        query: _.cloneDeep(req.query),
        ip: req.ip
      };

      req.guid = guid;

      forbiddenFields.forEach(field => {
        delete dataReceived.params[field];
        delete dataReceived.body[field];
        delete dataReceived.query[field];
      });

      dataReceived['user-agent'] = req.headers['user-agent'];
      dataReceived.information = {
        browser: req.useragent.browser,
        version: req.useragent.version,
        os: req.useragent.os,
        platform: req.useragent.platform
      };

      log.message(req.originalUrl, dataReceived, req.method, guid);
    } catch (e) {

      return reject(e);
    }

    return resolve();
  })
  .then(next)
  .catch(next);
};
