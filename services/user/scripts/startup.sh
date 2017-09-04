#!/bin/bash

set -x -u

torus run -e "$TORUS_ENV" -s "$TORUS_SERVICE" --org agavelab --project fullstack-training-backend -- ./node_modules/.bin/sequelize db:migrate --config config/config.js
torus run -e "$TORUS_ENV" -s "$TORUS_SERVICE" --org agavelab --project fullstack-training-backend -- ./node_modules/.bin/sequelize db:seed:all --config config/config.js
torus run -e "$TORUS_ENV" -s "$TORUS_SERVICE" --org agavelab --project fullstack-training-backend -- node app.js
