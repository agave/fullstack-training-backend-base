#!/bin/bash

set -u

yarn install

until nc -z -v -w30 user 80
do
  echo "Waiting for user to start..."
  sleep 5
done

#nodemon app.js

# Uncomment this to run dev container without nodemon
tail -f /dev/null
