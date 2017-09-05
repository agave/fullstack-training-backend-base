const superagent = require('superagent-defaults')();

class Api {
  constructor(host = 'http://localhost:3000', prefix = '/api/') {
    this.client = superagent.set('Content-type', 'application/json')
      .timeout({ response: 5000 });
    this.baseUrl = host + prefix;
    this.loggedIn = false;
  }

  request(method, url, data = {}, query = {}) {

    const client = this.client;
    const baseUrl = this.baseUrl;

    return new Promise(function(resolve, reject) {

      client[method](baseUrl + url).query(query).send(data)
      .end(function(err, result) {
        if (err) {
          return reject(err);
        }

        // Quickfix to follow prevoius agent structure
        const response = {
          status: result.status,
          data: result.body
        };

        return resolve(response);
      });
    });
  }

  requestWithFile(method, url, file, data = {}) {

    const client = this.client;
    const baseUrl = this.baseUrl;

    return new Promise(function(resolve, reject) {

      const request = client[method](baseUrl + url).attach('files', file);

      Object.keys(data).forEach(key => data[key] && request.field(key, data[key]));

      request
      .timeout({ response: 15000 })
      .end(function(err, result) {
        if (err) {
          return reject(err);
        }

        // Quickfix to follow prevoius agent structure
        const response = {
          status: result.status,
          data: result.body
        };

        return resolve(response);
      });
    });
  }

  setToken(token) {
    this.client.set('Authorization', `Bearer ${token}`);
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}

module.exports = new Api();
