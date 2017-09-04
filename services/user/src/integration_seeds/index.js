const UserSeeds = require('./user');
const { sequelize } = require('../models');

const query = "DELETE FROM users WHERE email != 'dev@app.com'";

return sequelize.query(query)
.then(() => UserSeeds.run())
.catch(error => {

  console.log(error);

  return true;
});
