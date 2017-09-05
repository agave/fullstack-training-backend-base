const JsonRefs = require('json-refs');
const YAML = require('js-yaml');

/* istanbul ignore next */
function getJson(path) {
  return JsonRefs.resolveRefsAt(path, {
    filter: [ 'relative', 'remote' ],
    loaderOptions: {
      processContent: (res, cb) => cb(undefined, YAML.safeLoad(res.text))
    }
  })
  .then(results => results.resolved);
}

module.exports.getJson = getJson;
