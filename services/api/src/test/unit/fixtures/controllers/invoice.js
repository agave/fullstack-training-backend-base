const _ = require('lodash');
const { apiCommonError } = require('../../../common/fixtures/error');
const guid = 'a62ca90f-854e-4227-aa28-81487d94c4f4';
const rfc = 'FODA900806965';
const today = new Date();
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
const emissionDate = new Date();
const expiration = new Date();
const user_id = 1;
const invoiceDigset = {
  client_rfc: rfc,
  company_rfc: rfc,
  subtotal: 1000,
  folio: 4,
  uuid: guid,
  company_regime: 'Some regimen',
  items: [ {
    count: 2,
    description: 'Some item',
    price: 10,
    single: 'Something',
    total: 20
  } ],
  cadenaOriginal: guid,
  sat_digital_stamp: guid,
  cfdi_digital_stamp: guid,
  company_address: 'Some address',
  emission_date: emissionDate,
  tax_total: 120,
  tax_percentage: 0.2,
  serie: 'ABCD1234',
  company_postal_code: '1234',
  written_amount: 'one thousand',
  total: 1160
};
const createData = {
  guid,
  user_id,
  client_rfc: rfc,
  company_rfc: rfc,
  subtotal: '1000.00',
  folio: 4,
  uuid: guid,
  company_regime: 'Some regimen',
  items: [ {
    count: '2.00',
    description: 'Some item',
    price: '10.00',
    single: 'Something',
    total: '20.00'
  } ],
  cadena_original: guid,
  sat_digital_stamp: guid,
  cfdi_digital_stamp: guid,
  company_address: 'Some address',
  emission_date: emissionDate.toISOString(),
  tax_total: '120.00',
  tax_percentage: '0.20',
  serie: 'ABCD1234',
  company_postal_code: '1234',
  written_amount: 'one thousand',
  cfdi: JSON.stringify(invoiceDigset),
  total: '1160.00'
};
const newInvoice = {
  id: 1,
  client_rfc: rfc,
  company_rfc: rfc
};
const invoiceList = [ newInvoice ];
const marketplaceList = {
  invoices: [ {
    id: 1,
    client_rfc: rfc,
    company_rfc: rfc,
    subtotal: '1'
  } ]
};
const estimate = {
  total: '100000',
  operation_cost: '3000',
  fund_total: '97000'
};
const operationTerm = {
  fund_date: today.toString(),
  expiration: today.toString(),
  operation_term: 90
};
const adminInvoiceDetail =  {
  invoice_detail: {
    company_rfc: 'GOHJ810526GS9',
    company_name: 'UploadInvoice',
    company_color: '#FF7372',
    client_rfc: 'CRJY47118049069',
    client_name: 'Sureplex',
    client_color: '#FF7372',
    business_name: 'JONATHAN JESUS GONZALEZ HERRERA',
    number: '6381472A-F8671280A1679164',
    emission_date: 'Sat Mar 11 2017 02:29:45 GMT+0000 (UTC)',
    expiration: 'Mon Nov 06 2017 00:00:00 GMT+0000 (UTC)',
    uuid: 'b9a6ed22-e43e-4ccf-bd5e-d6cf2d6d9d78',
    status: 'FUND_REQUESTED',
    total: 100000
  },
  operation_summary: {
    fund_date: 'Tue Aug 08 2017 00:00:00 GMT+0000 (UTC)',
    expiration: 'Mon Nov 06 2017 00:00:00 GMT+0000 (UTC)',
    operation_term: 91,
    commission: 0,
    fee: 250,
    earnings_fd: 250
  },
  cxc_payment: {
    annual_cost: 15,
    interest: 3791.67,
    interest_percentage: 3.79,
    reserve: 0,
    reserve_percentage: 0,
    fd_commission: 0,
    fd_commission_percentage: 0,
    total: 100000,
    fund_payment: 96208.33,
    expiration_payment: 0
  },
  investor_payment: {
    investor_name: 'Zum Zum',
    fund_date: 'Tue Aug 08 2017 00:00:00 GMT+0000 (UTC)',
    fund_total: 96208.33,
    earnings: 3791.67,
    earnings_percentage: 3.79,
    fee: 250,
    fee_percentage: 0.25,
    isr: 0,
    total_payment: 99750,
    include_isr: false
  }
};

const adminInvoiceDetailNotFormated = {
  invoice_detail: {
    company_rfc: 'GOHJ810526GS9',
    company_name: 'UploadInvoice',
    company_color: '#FF7372',
    client_rfc: 'CRJY47118049069',
    client_name: 'Sureplex',
    client_color: '#FF7372',
    business_name: 'JONATHAN JESUS GONZALEZ HERRERA',
    number: '6381472A-F8671280A1679164',
    emission_date: 'Sat Mar 11 2017 02:29:45 GMT+0000 (UTC)',
    expiration: 'Mon Nov 06 2017 00:00:00 GMT+0000 (UTC)',
    uuid: 'b9a6ed22-e43e-4ccf-bd5e-d6cf2d6d9d78',
    status: 'FUND_REQUESTED',
    total: '100000'
  },
  operation_summary: {
    fund_date: 'Tue Aug 08 2017 00:00:00 GMT+0000 (UTC)',
    expiration: 'Mon Nov 06 2017 00:00:00 GMT+0000 (UTC)',
    operation_term: '91',
    commission: '0',
    fee: '250',
    earnings_fd: '250'
  },
  cxc_payment: {
    annual_cost: '15.00',
    interest: '3791.67',
    interest_percentage: '3.79',
    reserve: '0.00',
    reserve_percentage: '0.00',
    fd_commission: '0.00',
    fd_commission_percentage: '0.00',
    total: '100000.00',
    fund_payment: '96208.33',
    expiration_payment: '0.00'
  },
  investor_payment: {
    investor_name: 'Zum Zum',
    fund_date: 'Tue Aug 08 2017 00:00:00 GMT+0000 (UTC)',
    fund_total: '96208.33',
    earnings: '3791.67',
    earnings_percentage: '3.79',
    fee: '250.00',
    fee_percentage: '0.25',
    isr: '0.00',
    total_payment: '99750.00',
    include_isr: false
  }
};

module.exports = {
  create: {
    request: {
      guid,
      files: [ {
        path: 'a/path/to/file.xml'
      } ],
      user: {
        user_id
      }
    },
    response,
    guid,
    xml: JSON.stringify(invoiceDigset),
    validatedXml: { digest: JSON.stringify(invoiceDigset) },
    path: 'a/path/to/file.xml',
    invoiceInfo: newInvoice,
    responseData: responseData('Invoice', newInvoice),
    sendUserParams: [ 'invoice', 'create', createData ],
    sendCfdiParams: [ 'invoice', 'validateAndExtract', {
      guid,
      xml: JSON.stringify(invoiceDigset)
    } ],
    responseParams: [
      'Upload invoice',
      responseData('Invoice', newInvoice),
      'response',
      guid
    ],
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getInvoices: {
    request: {
      guid,
      query: {
        page_size: 2,
        page: 2
      },
      user: {
        user_id: 1
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getInvoices', {
      guid,
      limit: 2,
      offset: 2,
      user_id: 1
    } ],
    invoiceList,
    messageCall: 'Get invoices',
    responseType: 'response',
    responseData: responseData('InvoiceList', invoiceList),
    responseError: {
      type: 'InvoiceList',
      error: apiCommonError
    },
    errorHelperParams: [
      'InvoiceList',
      apiCommonError,
      guid,
      response
    ]
  },
  getInvoice: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getInvoice', {
      guid,
      user_id: 1,
      invoice_id: 1
    } ],
    invoice: newInvoice,
    messageCall: 'Get invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  approve: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      body: {
        expiration
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'approve', {
      guid,
      user_id: 1,
      invoice_id: 1,
      expiration
    } ],
    invoice: newInvoice,
    messageCall: 'Approve invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  reject: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      body: {
        reason: 'Valid reason'
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'reject', {
      guid,
      user_id: 1,
      invoice_id: 1,
      reason: 'Valid reason'
    } ],
    invoice: newInvoice,
    messageCall: 'Reject invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getEstimate: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getEstimate', {
      guid,
      user_id: 1,
      invoice_id: 1
    } ],
    estimate,
    messageCall: 'Get estimate',
    responseType: 'response',
    responseData: responseData('Invoice', {
      total: 100000,
      operation_cost: 3000,
      fund_total: 97000
    }),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getDetail: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getDetail', {
      guid,
      user_id: 1,
      invoice_id: 1
    } ],
    invoice: newInvoice,
    messageCall: 'Get invoice detail',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  publish: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'publish', {
      guid,
      user_id: 1,
      invoice_id: 1
    } ],
    invoice: newInvoice,
    messageCall: 'Publish invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  fund: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'fund', {
      guid,
      user_id: 1,
      invoice_id: 1
    } ],
    invoice: newInvoice,
    messageCall: 'Fund invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  completed: {
    request: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc,
        user_role: 'ADMIN'
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      body: {
        cxp_payment: 1,
        cxp_payment_date: today,
        cxc_payment: 2,
        investor_payment: 3,
        fondeo_payment_date: today
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'completed', {
      guid,
      company_rfc: rfc,
      invoice_id: 1,
      cxp_payment: '1.00',
      cxp_payment_date: today,
      cxc_payment: '2.00',
      investor_payment: '3.00',
      fondeo_payment_date: today
    } ],
    invoice: newInvoice,
    messageCall: 'Completed invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ],
    invalidCXPDateErrorHelperParams: [
      'Invoice',
      {
        path: 'cxp_payment_date',
        message: 'Invalid cxp_payment_date'
      },
      guid,
      response
    ],
    invalidFondeoDateErrorHelperParams: [
      'Invoice',
      {
        path: 'fondeo_payment_date',
        message: 'Invalid fondeo_payment_date'
      },
      guid,
      response
    ]
  },
  lost: {
    request: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      body: {
        cxc_payment: 1,
        investor_payment: 1,
        payment_date: today
      }
    },
    requestBadPaymentDate: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      body: {
        cxc_payment: 1,
        investor_payment: 1,
        payment_date: 'today'
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'lost', {
      guid,
      company_rfc: rfc,
      invoice_id: 1,
      cxc_payment: '1.00',
      investor_payment: '1.00',
      payment_date: today
    } ],
    invoice: newInvoice,
    messageCall: 'Lost invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ],
    errorDateParams: [
      'Invoice',
      {
        path: 'payment_date',
        message: 'Invalid payment_date'
      },
      guid,
      response
    ]
  },
  latePayment: {
    request: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      body: {
        cxc_payment: 1,
        investor_payment: 1,
        cxp_payment: 1,
        cxp_payment_date: today,
        fondeo_payment_date: today
      }
    },
    requestBadFondeoDate: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      body: {
        cxc_payment: 1,
        investor_payment: 1,
        cxp_payment: 1,
        cxp_payment_date: today,
        fondeo_payment_date: 'today'
      }
    },
    requestBadCxpDate: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      body: {
        cxc_payment: 1,
        investor_payment: 1,
        cxp_payment: 1,
        cxp_payment_date: 'today',
        fondeo_payment_date: today
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'latePayment', {
      guid,
      company_rfc: rfc,
      invoice_id: 1,
      cxc_payment: '1.00',
      investor_payment: '1.00',
      cxp_payment: '1.00',
      fondeo_payment_date: today,
      cxp_payment_date: today
    } ],
    invoice: newInvoice,
    messageCall: 'Late payment invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ],
    errorFondeoDateParams: [
      'Invoice',
      {
        path: 'fondeo_payment_date',
        message: 'Invalid fondeo_payment_date'
      },
      guid,
      response
    ],
    errorCxpDateParams: [
      'Invoice',
      {
        path: 'cxp_payment_date',
        message: 'Invalid cxp_payment_date'
      },
      guid,
      response
    ]
  },
  rejectPublished: {
    cxcRequest: {
      guid,
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      user: {
        user_role: 'CXC',
        company_rfc: rfc
      },
      body: {}
    },
    adminRequest: {
      guid,
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      user: {
        user_role: 'ADMIN',
        company_rfc: rfc
      },
      body: {
        reason: 'Valid reason'
      }
    },
    response,
    guid,
    cxcSendParams: [ 'invoice', 'rejectPublished', {
      guid,
      invoice_id: 1,
      user_role: 'CXC',
      user_rfc: rfc,
      reason: 'Por solicitud del emisor de la factura'
    } ],
    adminSendParams: [ 'invoice', 'rejectPublished', {
      guid,
      invoice_id: 1,
      user_role: 'ADMIN',
      user_rfc: rfc,
      reason: 'Valid reason'
    } ],
    invoice: newInvoice,
    messageCall: 'Reject published invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  rejectFunded: {
    request: {
      guid,
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      },
      body: {
        reason: 'Valid reason'
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'rejectFunded', {
      guid,
      invoice_id: 1,
      reason: 'Valid reason'
    } ],
    invoice: newInvoice,
    messageCall: 'Reject fund requested invoice',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  approveFund: {
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
    sendParams: [ 'invoice', 'approveFund', {
      guid,
      invoice_id: 1,
      company_rfc: rfc
    } ],
    invoice: newInvoice,
    messageCall: 'Approve fund request',
    responseType: 'response',
    responseData: responseData('Invoice', newInvoice),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getFundEstimate: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getFundEstimate', {
      guid,
      user_id: 1,
      invoice_id: 1
    } ],
    fundEstimate: {
      expiration,
      subtotal: '10000000',
      interest: '10000000',
      commission: '100000',
      fund_total: '100000',
      reserve: '100000000',
      fund_payment: '1000',
      expiration_payment: '1',
      tax_total: '1000000'
    },
    messageCall: 'Get fund estimate',
    responseType: 'response',
    responseData: {
      type: 'Invoice',
      data: {
        expiration,
        subtotal: 10000000,
        interest: 10000000,
        commission: 100000,
        fund_total: 100000,
        reserve: 100000000,
        fund_payment: 1000,
        expiration_payment: 1,
        tax_total: 1000000
      }
    },
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getXml: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getXml', {
      guid,
      user_id: 1,
      invoice_id: 1
    } ],
    invoice: newInvoice,
    messageCall: 'Get invoice xml',
    responseType: 'response',
    responseData: {
      xml: 'ASDZXCQWE'
    },
    setCallWith: { 'Content-Disposition': 'attachment; filename=\"invoice1.xml\"' },
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getMarketplace: {
    request: {
      guid,
      query: {
        page_size: 2,
        page: 2
      },
      user: {
        user_id: 1
      }
    },
    requestOrder: {
      guid,
      query: {
        page_size: 2,
        page: 2,
        order_by: 'Something',
        order_desc: 'true'
      },
      user: {
        user_id: 1
      }
    },
    requestSubtotals: {
      guid,
      query: {
        page_size: 2,
        page: 2,
        order_by: 'Something',
        order_desc: 'true',
        min_total: 300,
        max_total: 500
      },
      user: {
        user_id: 1
      }
    },
    requestInvalidStartDate: {
      guid,
      query: {
        page_size: 2,
        page: 2,
        start_date: 'something'
      },
      user: {
        user_id: 1
      }
    },
    requestInvalidEndtDate: {
      guid,
      query: {
        page_size: 2,
        page: 2,
        end_date: 'something'
      },
      user: {
        user_id: 1
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getMarketplace', {
      guid,
      limit: 2,
      offset: 2,
      user_id: 1,
      client_name: undefined,
      start_date: undefined,
      end_date: undefined
    } ],
    sendParamsOrder: [ 'invoice', 'getMarketplace', {
      guid,
      limit: 2,
      offset: 2,
      user_id: 1,
      order_by: 'Something',
      order_desc: true,
      client_name: undefined,
      start_date: undefined,
      end_date: undefined
    } ],
    sendParamsSubtotals: [ 'invoice', 'getMarketplace', {
      guid,
      limit: 2,
      offset: 2,
      user_id: 1,
      order_by: 'Something',
      order_desc: true,
      min_total: '300',
      max_total: '500',
      client_name: undefined,
      start_date: undefined,
      end_date: undefined
    } ],
    marketplaceList,
    messageCall: 'Get marketplace',
    responseType: 'response',
    responseData: responseData('Marketplace', marketplaceList),
    responseError: {
      type: 'Marketplace',
      error: apiCommonError
    },
    errorHelperParams: [
      'Marketplace',
      apiCommonError,
      guid,
      response
    ],
    startDateError: [
      'Marketplace',
      {
        path: 'start_date',
        message: 'Invalid start_date'
      },
      guid,
      response
    ],
    endDateError: [
      'Marketplace',
      {
        path: 'end_date',
        message: 'Invalid end_date'
      },
      guid,
      response
    ]
  },
  getInvestorFundEstimate: {
    request: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getInvestorFundEstimate', {
      guid,
      user_id: 1,
      invoice_id: 1,
      company_rfc: rfc
    } ],
    fundEstimate: {
      total: '100000',
      earnings: '2500',
      commission: '500',
      isr: '25',
      include_isr: true,
      perception: '9675'
    },
    messageCall: 'Get investor fund estimate',
    responseType: 'response',
    responseData: responseData('Invoice', {
      total: 100000,
      earnings: 2500,
      commission: 500,
      isr: 25,
      include_isr: true,
      perception: 9675
    }),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getInvestorProfitEstimate: {
    request: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getInvestorProfitEstimate', {
      guid,
      user_id: 1,
      invoice_id: 1,
      company_rfc: rfc
    } ],
    profitEstimate: {
      gain: '2500',
      gain_percentage: '2.5',
      annual_gain: '15'
    },
    messageCall: 'Get investor profit estimate',
    responseType: 'response',
    responseData: responseData('Invoice', {
      gain: 2500,
      gain_percentage: 2.5,
      annual_gain: 15
    }),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getInvestorInvoices: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      query: {
        page_size: 25,
        page: 1
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getInvestorInvoices', {
      guid,
      user_id: 1,
      limit: 25,
      offset: 1
    } ],
    invoiceList,
    messageCall: 'Get investor invoices',
    responseType: 'response',
    responseData: responseData('InvoiceList', invoiceList),
    responseError: {
      type: 'InvoiceList',
      error: apiCommonError
    },
    errorHelperParams: [
      'InvoiceList',
      apiCommonError,
      guid,
      response
    ]
  },
  getInvestorFundDetail: {
    request: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getInvestorFundDetail', {
      guid,
      user_id: 1,
      invoice_id: 1,
      company_rfc: rfc
    } ],
    operationTerm,
    messageCall: 'Get investor fund detail',
    responseType: 'response',
    responseData: responseData('Invoice', operationTerm),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getInvoicePaymentSummary: {
    request: {
      guid,
      user: {
        user_id: 1,
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getInvoicePaymentSummary', {
      guid,
      invoice_id: 1,
      company_rfc: rfc
    } ],
    summary: {
      payment_summary: {
        total: '100000.00',
        interest: '2500.00',
        commission: '500.00',
        reserve: '10000.00',
        fund_payment: '87000.00',
        expiration_payment: '10000.00',
        operation_cost: '3000.00',
        fund_total: '97000.00' },
      financial_summary: {
        fund_date: today.toString(),
        expiration: today.toString(),
        operation_term: 60,
        gain: '2500.00',
        gain_percentage: '2.50',
        annual_gain: '15.00'
      }
    },
    messageCall: 'Get invoice payment summary',
    responseType: 'response',
    responseData: responseData('Invoice', {
      payment_summary: {
        total: 100000,
        interest: 2500,
        commission: 500,
        reserve: 10000,
        fund_payment: 87000,
        expiration_payment: 10000,
        operation_cost: 3000,
        fund_total: 97000 },
      financial_summary: {
        fund_date: today.toString(),
        expiration: today.toString(),
        operation_term: 60,
        gain: 2500,
        gain_percentage: 2.5,
        annual_gain: 15
      }
    }),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  },
  getAdminInvoices: {
    request: {
      guid,
      user: {
        user_id: 1
      },
      query: {
        page_size: 25,
        page: 1,
        order_by: 'Something',
        order_desc: 'true',
        client_name: 'client',
        company_name: 'company',
        investor_name: 'investor',
        status: 'approved',
        start_fund_date: 'Tue Aug 01 2017 19:49:29 GMT+0000 (UTC)',
        end_fund_date: 'Tue Aug 03 2017 19:49:29 GMT+0000 (UTC)',
        start_expiration_date: 'Tue Aug 05 2017 19:49:29 GMT+0000 (UTC)',
        end_expiration_date: 'Tue Aug 10 2017 19:49:29 GMT+0000 (UTC)'
      }
    },
    requestInvalidStartFundDate: {
      guid,
      query: {
        start_fund_date: 'something'
      },
      user: {
        user_id: 1
      }
    },
    requestInvalidEndFundDate: {
      guid,
      query: {
        end_fund_date: 'something'
      },
      user: {
        user_id: 1
      }
    },
    requestInvalidStartExpirationDate: {
      guid,
      query: {
        start_expiration_date: 'something'
      },
      user: {
        user_id: 1
      }
    },
    requestInvalidEndExpirationDate: {
      guid,
      query: {
        end_expiration_date: 'something'
      },
      user: {
        user_id: 1
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getAdminInvoices', {
      guid,
      user_id: 1,
      limit: 25,
      offset: 1,
      order_by: 'Something',
      order_desc: true,
      client_name: 'client',
      company_name: 'company',
      investor_name: 'investor',
      status: 'approved',
      start_fund_date: 'Tue Aug 01 2017 19:49:29 GMT+0000 (UTC)',
      end_fund_date: 'Tue Aug 03 2017 19:49:29 GMT+0000 (UTC)',
      start_expiration_date: 'Tue Aug 05 2017 19:49:29 GMT+0000 (UTC)',
      end_expiration_date: 'Tue Aug 10 2017 19:49:29 GMT+0000 (UTC)'
    } ],
    invoiceList,
    messageCall: 'Get admin invoices',
    responseType: 'response',
    responseData: responseData('InvoiceList', invoiceList),
    responseError: {
      type: 'InvoiceList',
      error: apiCommonError
    },
    errorHelperParams: [
      'InvoiceList',
      apiCommonError,
      guid,
      response
    ],
    startFundDateError: [
      'InvoiceList',
      {
        path: 'start_fund_date',
        message: 'Invalid start_fund_date'
      },
      guid,
      response
    ],
    endFundDateError: [
      'InvoiceList',
      {
        path: 'end_fund_date',
        message: 'Invalid end_fund_date'
      },
      guid,
      response
    ],
    startExpirationDateError: [
      'InvoiceList',
      {
        path: 'start_expiration_date',
        message: 'Invalid start_expiration_date'
      },
      guid,
      response
    ],
    endExpirationDateError: [
      'InvoiceList',
      {
        path: 'end_expiration_date',
        message: 'Invalid end_expiration_date'
      },
      guid,
      response
    ]
  },
  getInvoiceDetailAsAdmin: {
    request: {
      guid,
      user: {
        company_rfc: rfc
      },
      swagger: {
        params: {
          id: {
            value: 1
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'invoice', 'getInvoiceDetailAsAdmin', {
      guid,
      invoice_id: 1
    } ],
    adminInvoiceDetailNotFormated,
    adminInvoiceDetailWithoutOperationSummaryNotFormated:
      _.set(_.cloneDeep(adminInvoiceDetailNotFormated), 'operation_summary', {}),
    adminInvoiceDetailWithoutcxcPaymentNotFormated:
      _.set(_.cloneDeep(adminInvoiceDetailNotFormated), 'cxc_payment', {}),
    adminInvoiceDetailWithoutInvestorPaymentNotFormated:
      _.set(_.cloneDeep(adminInvoiceDetailNotFormated), 'investor_payment', {}),
    messageCall: 'Get invoice detail as admin',
    responseType: 'response',
    responseData: responseData('Invoice', adminInvoiceDetail),
    responseDataWithoutOperationSummary:
      responseData('Invoice', _.set(_.cloneDeep(adminInvoiceDetail), 'operation_summary', {})),
    responseDataWithoutcxcPayment:
      responseData('Invoice', _.set(_.cloneDeep(adminInvoiceDetail), 'cxc_payment', {})),
    responseDataWithoutInvestorPayment:
      responseData('Invoice', _.set(_.cloneDeep(adminInvoiceDetail), 'investor_payment', {})),
    responseError: {
      type: 'Invoice',
      error: apiCommonError
    },
    errorHelperParams: [
      'Invoice',
      apiCommonError,
      guid,
      response
    ]
  }
};
