const { apiCommonError } = require('../../../common/fixtures/error');
const guid = 'a62ca90f-854e-4227-aa28-81487d94c4f4';
const rfc = 'FODA900806965';
const response = {
  send: () => {
    return;
  },
  set: () => {
    return;
  }
};
const responseData = (type, data) => {
  return {
    type,
    data
  };
};
const user_id = 1;
const deposit_date = new Date();
const file = {
  path: 'path/to/file.png',
  originalname: 'file.png',
  mimetype: 'image/png'
};
const timestamp = new Date(2017, 6, 3).getTime();
const filename = `${user_id}-${timestamp}.${file.originalname.split('.').pop()}`;
const investorDepositS3Key = `investors/${rfc}/deposits/${filename}`;
const clientInvoicePaymentS3Key = `cxp/${rfc}/payments/${filename}`;
const invoice = {
  id: 123
};

module.exports = {
  withdraw: {
    request: {
      guid,
      user: {
        user_id
      },
      body: {
        amount: 100
      }
    },
    response,
    guid,
    sendParams: [ 'transaction', 'withdraw', {
      guid,
      user_id: 1,
      amount: '100.00'
    } ],
    transaction: {
      id: 1,
      amount: '100.00',
      data: '{}'
    },
    messageCall: 'Create withdraw',
    responseType: 'response',
    responseData: responseData('Transaction', {
      id: 1,
      amount: 100,
      data: {}
    }),
    responseError: {
      type: 'Transaction',
      error: apiCommonError
    },
    errorHelperParams: [
      'Transaction',
      apiCommonError,
      guid,
      response
    ]
  },
  deposit: {
    request: {
      guid,
      user: {
        user_id,
        company_rfc: rfc
      },
      body: {
        amount: '100',
        deposit_date
      },
      files: [ file ]
    },
    response,
    guid,
    fileUrl: 'url/to/file.png',
    buffer: 'buffer',
    sendParams: [ 'transaction', 'deposit', {
      guid,
      user_id: 1,
      amount: '100',
      deposit_date,
      receipt: investorDepositS3Key
    } ],
    readFileParams: [
      file.path
    ],
    uploadParams: [
      investorDepositS3Key,
      'buffer',
      guid
    ],
    transaction: {
      id: 1,
      amount: '100.00',
      data: `{"key":"${investorDepositS3Key}"}`
    },
    messageCall: 'Create deposit',
    responseType: 'response',
    responseData: responseData('Transaction', {
      id: 1,
      amount: 100,
      data: { url: 'url/to/file.png' }
    }),
    responseError: {
      type: 'Transaction',
      error: apiCommonError
    },
    errorHelperParams: [
      'Transaction',
      apiCommonError,
      guid,
      response
    ],
    noFileErrorHelperParams: [
      'Transaction',
      {
        path: 'receipt',
        message: 'Value is required but was not provided'
      },
      guid,
      response
    ],
    invalidFileErrorHelperParams: [
      'Transaction',
      {
        path: 'receipt',
        message: 'Incorrect file type'
      },
      guid,
      response
    ],
    key: investorDepositS3Key
  },
  getPendingTransactions: {
    request: {
      guid,
      swagger: {
        params: {
          rfc: {
            value: rfc
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'transaction', 'getTransactions', {
      guid,
      rfc,
      status: 'PENDING'
    } ],
    baseUrl: 'this/is/base/url/to/',
    transactions: {
      transactions: [
        {
          id: 1,
          amount: '100.00',
          data: '{"id": 1}'
        }, {
          id: 2,
          amount: '200.00',
          data: '{ "key": "file.png" }'
        }
      ],
      balance: '300.00'
    },
    messageCall: 'Get company pending transactions',
    responseType: 'response',
    responseData: responseData('TransactionList', {
      transactions: [
        {
          id: 1,
          amount: 100,
          data: { id: 1 }
        }, {
          id: 2,
          amount: 200.00,
          data: {
            url: 'this/is/base/url/to/file.png'
          }
        }
      ],
      balance: 300
    }),
    responseError: {
      type: 'TransactionList',
      error: apiCommonError
    },
    errorHelperParams: [
      'TransactionList',
      apiCommonError,
      guid,
      response
    ]
  },
  approve: {
    request: {
      guid,
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      user: {
        company_rfc: rfc
      }
    },
    response,
    guid,
    sendParams: [ 'transaction', 'approve', {
      guid,
      id: 1,
      company_rfc: rfc
    } ],
    transaction: {
      id: 1,
      amount: '100.00',
      data: '{"id": 1}'
    },
    transactionWithKey: {
      id: 1,
      amount: '100.00',
      data: '{"id": 1, "key": "key"}'
    },
    transactionWithValidKey: {
      id: 1,
      amount: '100.00',
      data: '{"id": 1, "key": "key2"}'
    },
    key: 'key',
    baseUrl: 'this/is/base/url/to/',
    messageCall: 'Approve transaction',
    responseType: 'response',
    responseData: responseData('Transaction', {
      id: 1,
      amount: 100,
      data: { id: 1 }
    }),
    responseError: {
      type: 'Transaction',
      error: apiCommonError
    },
    errorHelperParams: [
      'Transaction',
      apiCommonError,
      guid,
      response
    ]
  },
  reject: {
    request: {
      guid,
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      user: {
        company_rfc: rfc
      },
      body: {
        reason: 'A problem'
      }
    },
    response,
    guid,
    sendParams: [ 'transaction', 'reject', {
      guid,
      id: 1,
      company_rfc: rfc,
      reason: 'A problem'
    } ],
    transaction: {
      id: 1,
      amount: '100.00',
      data: '{"id": 1}'
    },
    transactionWithKey: {
      id: 1,
      amount: '100.00',
      data: '{"id": 1, "key": "key"}'
    },
    transactionWithValidKey: {
      id: 1,
      amount: '100.00',
      data: '{"id": 1, "key": "key2"}'
    },
    key: 'key',
    baseUrl: 'this/is/base/url/to/',
    messageCall: 'Reject transaction',
    responseType: 'response',
    responseData: responseData('Transaction', {
      id: 1,
      amount: 100,
      data: { id: 1 }
    }),
    responseError: {
      type: 'Transaction',
      error: apiCommonError
    },
    errorHelperParams: [
      'Transaction',
      apiCommonError,
      guid,
      response
    ]
  },
  createClientInvoicePayment: {
    request: {
      guid,
      user: {
        user_id,
        user_role: 'ADMIN',
        company_rfc: rfc
      },
      body: {
        amount: 100,
        payment_date: deposit_date
      },
      swagger: {
        params: {
          id: {
            value: invoice.id
          }
        }
      },
      files: [ file ]
    },
    response,
    guid,
    fileUrl: 'url/to/file.png',
    buffer: 'buffer',
    sendParamsWithKey: [ 'transaction', 'createClientInvoicePayment', {
      guid,
      user_id: 1,
      user_role: 'ADMIN',
      company_rfc: rfc,
      amount: '100',
      payment_date: deposit_date,
      receipt: clientInvoicePaymentS3Key,
      invoice_id: invoice.id
    } ],
    sendParamsWithoutKey: [ 'transaction', 'createClientInvoicePayment', {
      guid,
      user_id: 1,
      user_role: 'ADMIN',
      company_rfc: rfc,
      amount: '100',
      payment_date: deposit_date,
      invoice_id: invoice.id
    } ],
    readFileParams: [
      file.path
    ],
    uploadParams: [
      clientInvoicePaymentS3Key,
      'buffer',
      guid
    ],
    invoice: {
      id: 1,
      total: '100'
    },
    messageCall: 'Create client invoice payment',
    responseType: 'response',
    responseData: {
      type: 'Invoice',
      data: {
        id: 1,
        total: 100
      }
    },
    responseError: {
      type: 'Transaction',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ],
    invalidFileErrorHelperParams: [
      'Invoice',
      {
        path: 'receipt',
        message: 'Incorrect file type'
      },
      guid,
      response
    ],
    dateErrorHelperParams: [
      'Invoice',
      {
        path: 'payment_date',
        message: 'Invalid payment_date'
      },
      guid,
      response
    ],
    key: clientInvoicePaymentS3Key
  },
  getClientInvoicePayment: {
    request: {
      guid,
      user: {
        user_id,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: invoice.id
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'transaction', 'getClientInvoicePayment', {
      guid,
      user_id,
      invoice_id: invoice.id
    } ],
    key: '/file/path.png',
    transactionWithKey: {
      id: 1,
      amount: '100',
      data: JSON.stringify({
        invoice_id: invoice.id,
        key: '/file/path.png',
        payment_date: 'payment_date'
      })
    },
    transactionWithoutKey: {
      id: 1,
      amount: '100',
      data: JSON.stringify({
        invoice_id: invoice.id,
        payment_date: 'payment_date'
      })
    },
    s3Url: 'this/is/base/url/to/file.png',
    messageCall: 'Get client invoice payment',
    responseType: 'response',
    responseDataWithUrl: responseData('Transaction', {
      id: 1,
      amount: 100.00,
      data: {
        invoice_id: invoice.id,
        payment_date: 'payment_date',
        url: 'this/is/base/url/to/file.png'
      }
    }),
    responseDataWithoutUrl: responseData('Transaction', {
      id: 1,
      amount: 100.00,
      data: {
        invoice_id: invoice.id,
        payment_date: 'payment_date'
      }
    }),
    responseError: {
      type: 'Transaction',
      error: apiCommonError
    },
    errorHelperParams: [
      'Transaction',
      apiCommonError,
      guid,
      response
    ]
  }
};
