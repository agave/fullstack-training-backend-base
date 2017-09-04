const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const config = require('../config/config');
const Logger = require('/var/lib/core/js/log');
const log = new Logger(module);
const pug = require('pug');
const env = config.env;
const sesInternalErrorCodes = [ 'InternalFailure', 'ServiceUnavailable' ];

aws.config.update({
  accessKeyId: config.aws.keyId,
  secretKey: config.aws.secretKey,
  region: config.aws.ses.region
});

class Mailer {
  constructor() {

    this.transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: config.aws.ses.apiVersion
      }),
      sendingRate: config.aws.ses.sendingRate
    });

    this.options = {
      from: `App <${config.aws.ses.sender}>`
    };
  }

  isTest() {
    return env === 'test';
  }

  send(template, data, email, subject, guid = '') {

    if (this.isTest()) {
      return Promise.resolve();
    }

    if (!template) {
      const error = {
        errors: [ {
          path: 'Mailer',
          message: 'Template not found'
        } ]
      };

      return Promise.reject(error);
    }

    const mailTransport = this.transporter;
    const mailOptions = this.options;
    const templatePath = 'mailer/' + template + '.pug';

    data.apiBaseUrl = config.apiBaseUrl;
    data.webBaseUrl = config.webBaseUrl;
    mailOptions.to = email;
    mailOptions.subject = subject;
    mailOptions.html = pug.renderFile(templatePath, data);

    return new Promise(function(resolve, reject) {

      mailTransport.sendMail(mailOptions, function(err, info) {

        if (err) {
          log.error('SES service', guid, err);

          // Hard code this for sandbox environments
          const internalError = sesInternalErrorCodes.indexOf(err.code) > -1;

          if (!internalError) {
            return resolve();
          }

          const error = {
            errors: [ {
              path: 'Amazon service',
              message: 'There was a problem delivering your message'
            } ]
          };

          return reject(error);
        }

        log.message('Email sent', info, 'Mailer', guid);

        return resolve();
      });
    });
  }
}

module.exports = new Mailer();
