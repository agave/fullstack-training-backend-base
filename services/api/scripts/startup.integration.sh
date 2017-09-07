#!/bin/bash

set -e

yarn install

until nc -z -v -w30 user 80
do
  echo "Waiting for user to start..."
  sleep 5
done

nodemon app.js
