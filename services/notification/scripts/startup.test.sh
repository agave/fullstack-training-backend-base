#!/bin/bash

set -e

until nc -z -v -w30 kafka 9092
do
  echo "Waiting for kafka to start..."
  sleep 5
done

make unit-test
make functional-test
