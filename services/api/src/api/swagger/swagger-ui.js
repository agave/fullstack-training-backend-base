module.exports = function init(app, schema) {
  /* istanbul ignore next */
  app.get('/docs/swagger/', (req, res) => res.send(schema));
};
