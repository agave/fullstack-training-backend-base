const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const _         = require('lodash');
const basename  = path.basename(module.filename);
const config    = require(path.join(__dirname, '/../config/config'));
const db        = {};
let sequelize = {};

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const modelDescription = require(path.join(__dirname, file));
    const modelFunctions = require(path.join(__dirname, '/../api/models/' + file));
    const modelDefinition = _.merge({}, modelDescription, modelFunctions);
    const model = sequelize.define(file.replace('.js', ''), modelDefinition.attributes, modelDefinition.options);

    db[model.name] = model;

  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
