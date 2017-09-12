#!/bin/bash

set -e

yarn install

until nc -z -v -w30 kafka 9092
do
  echo "Waiting for kafka to start..."
  sleep 5
done

nodemon app.js
