#!/bin/bash

./node_modules/.bin/sequelize db:migrate --config config/config.js
./node_modules/.bin/sequelize db:seed:all --config config/config.js

export NODE_ENV=test

./node_modules/.bin/sequelize db:migrate --config config/config.js
./node_modules/.bin/sequelize db:seed:all --config config/config.js

export NODE_ENV=development
