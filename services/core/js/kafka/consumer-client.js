const Kafka = require('/var/lib/app/node_modules/node-rdkafka');
const env = process.env.NODE_ENV || 'development';
const Logger = require('/var/lib/core/js/log');
const log = new Logger(module);

class KafkaConsumer {
  constructor(config) {
    const configClone = {};
    const offsetReset = config.offsetReset;
    const maxMessages = config.maxMessages;

    Object.assign(configClone, config);

    this.topics = configClone.topics;

    log.message('Intitalizing consumer', configClone, 'ConsumerInfo');

    delete configClone.topics;
    delete configClone.offsetReset;
    delete configClone.maxMessages;

    if (env !== 'test') {
      configClone.rebalance_cb = this.rebalancing;
    }
    configClone.offset_commit_cb = this.commit_cb;

    this.consumer = new Kafka.KafkaConsumer(configClone, {
      'auto.offset.reset': offsetReset,
      'consume.callback.max.messages': maxMessages
    });

    this.consumer.on('disconnected', () => log.warn('Consumer disconnected'));
    this.consumer.on('event.error', err => this.errorHandler(err));
    this.consumer.on('event.log', e => log.message('Consumer event', e, 'ConsumerInfo'));
  }

  connect(eventHandler) {
    this.consumer
    .on('ready', () => {
      this.ready = true;
      this.consumer.subscribe(this.topics);
      this.consumer.consume();
    })
    .on('data', data => this.dataHandler(data, eventHandler));

    this.consumer.connect();

    return new Promise((resolve, reject) => {
      setTimeout(() => this.ready ? resolve() : reject(new Error('Connection failed')), 3000);
    });
  }

  dataHandler(data, handler) {
    data.value = JSON.parse(data.value.toString());

    return handler.handle(data)
    .then(() => this.commit(data))
    .catch(err => {
      const message = err ? err.message : 'no error info';

      log.error(err, data.value.guid, {
        msg: `Failed to handle ${data.topic} at offset ${data.offset}: ${message}`
      });
    });
  }

  commit(data) {
    data.offset = data.offset + 1;
    this.consumer.commit(data, err => {
      if (err) {
        return log.error(err, data.value.guid, {
          msg: `Failed to commit ${data.topic} at offset ${data.offset}`
        });
      }

      return true;
    });
  }

  errorHandler(err) {
    log.error(err, '', {
      msg: 'Consumer error'
    });
  }

  disconnect() {
    this.consumer.disconnect();
  }

  rebalancing(err, assignment) {

    const timeout = 5000;

    log.message('Rebalance event', assignment, 'RebalanceInfo');

    if (err.code === Kafka.CODES.ERRORS.ERR__ASSIGN_PARTITIONS) {

      try {
        this.assign(assignment);
      } catch (e) {
        log.error(e, '', {
          msg: 'Assign partition error'
        });
      }

      const topic = assignment[0].topic;
      const partition = assignment[0].partition;

      this.queryWatermarkOffsets(topic, partition, timeout, function(error, offsets) {

        if (error) {
          log.error(err, '', {
            msg: 'Offset commit error'
          });
        }

        log.message('Offset watermark', offsets, 'OffsetWatermarkInfo');
      });
    } else if (err.code === Kafka.CODES.ERRORS.ERR__REVOKE_PARTITIONS) {
      this.unassign();
    } else {
      log.error(err, '', {
        msg: 'Consumer rebalancing error'
      });
    }
  }

  commit_cb(err, topicPartitions) {

    if (err) {
      log.error(err, '', {
        msg: 'Offset commit error'
      });
    }

    log.message('Offset commit', topicPartitions, 'OffsetInfo');
  }
}

module.exports = KafkaConsumer;
