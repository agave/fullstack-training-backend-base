const fs = require('fs');
const path = require('path');
const protosPath = '/var/lib/core/protos';
const grpc = require('grpc');
const timeout = process.env.GRPC_TIMEOUT || 10;

class Gateway {
  constructor() {
    const credentials = grpc.credentials.createInsecure();
    const directories = this.getDirectories(protosPath);

    directories.forEach(directory => {
      if (directory === 'api') {
        return;
      }

      this[directory] = {};

      const files = this.getFiles(`${protosPath}/${directory}/`);

      files.forEach(file => {
        const load = grpc.load(`${protosPath}/${directory}/${file}.proto`)[file];
        const uppercase = `${file.charAt(0).toUpperCase()}${file.slice(1)}`;

        this[directory][file] = new load[uppercase](`${directory}:80`, credentials);
      });
    });
  }

  request(client, method, data) {
    /* istanbul ignore next */
    return new Promise((resolve, reject) => {
      const deadline = new Date();

      deadline.setSeconds(deadline.getSeconds() + timeout);

      client[method](data, { deadline }, (error, result) => {
        if (error) {
          let parsedError;

          try {
            parsedError = JSON.parse(error.message);
          } catch (e) {
            parsedError = {
              path: 'Internal server error',
              message: error
            };
          }

          return reject(parsedError);
        }

        return resolve(result);
      });
    });
  }

  getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
      .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
  }

  getFiles(srcpath) {
    return fs.readdirSync(srcpath)
      .filter(file => fs.statSync(path.join(srcpath, file)).isFile())
      .map(file => {
        return file.slice(0, -6);
      });
  }

  sendUser(service, method, data) {
    return this.request(this.user[service], method, data);
  }

  sendCfdi(service, method, data) {
    return this.request(this.cfdi[service], method, data);
  }
}

module.exports = new Gateway();
