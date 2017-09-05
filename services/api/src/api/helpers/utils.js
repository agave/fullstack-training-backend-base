const fs = require('fs');

module.exports = {
  readFile: function(path) {

    return new Promise((resolve, reject) => {

      fs.readFile(path, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  },
  unlink: function(path) {

    return new Promise((resolve, reject) => {

      fs.unlink(path, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  },
  readDir: function(path) {

    return new Promise((resolve, reject) => {

      fs.readdir(path, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }
};
