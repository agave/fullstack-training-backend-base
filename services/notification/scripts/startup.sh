#!/bin/bash

set -x -u

torus run -e "$TORUS_ENV" -s "$TORUS_SERVICE" --org agavelab --project fullstack-training-backend -- node app.js
