const ip = '192.168.0.1';
const agentHeaders = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 ' +
  '(KHTML, like Gecko) Version/10.0 Mobile/14D27 Safari/602.1';
const useragent = {
  browser: 'Safari',
  version: '10',
  os: 'OS X',
  platform: 'iPhone'
};

module.exports = {
  uuid: 'abcde12345',
  request: {
    ip,
    originalUrl: '/this/url',
    method: 'get',
    params: {
      first: 1,
      password: 'deleted'
    },
    body: {
      second: 2,
      password: 'deleted'
    },
    query: {
      third: 3,
      password: 'deleted'
    },
    headers: {
      'user-agent': agentHeaders
    },
    useragent
  },
  logged: {
    params: {
      first: 1
    },
    body: {
      second: 2
    },
    query: {
      third: 3
    },
    ip,
    'user-agent': agentHeaders,
    information: useragent
  }
};
