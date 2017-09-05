const _ = require('lodash');
const { apiCommonError } = require('../../../common/fixtures/error');
const guid = 'a62ca90f-854e-4227-aa28-81487d94c4f4';
const rfc = 'FODA900806965';
const clabe = '002090700355936431';
const response = {
  send: () => {
    return;
  }
};
const companyNotFoundError = {
  path: 'Company',
  message: 'Not found'
};
const company = {
  rfc,
  role: 'ADMIN',
  name: 'Fondeo Directo',
  business_name: 'Fondeo Directo',
  holder: 'Fondeo Directo',
  bank: 'BANAMEX',
  bank_account: '70035593622',
  clabe: '002090700355936431'
};
const bankInfo = {
  name: 'Fondeo',
  account: '123456789'
};
const newUser = {
  name: 'John Doe',
  email: 'john@doe.com',
  type: 'cxc'
};
const operationCost = {
  fd_commission: 1,
  reserve: 3,
  annual_cost: 2
};
const stringOperationCost = {
  fd_commission: '1.00',
  reserve: '3.00',
  annual_cost: '2.00'
};
const operationInvestor_cost = {
  fee: 5
};
const stringOperationInvestorCost = {
  fee: '5.00'
};
const responseData = (type, data) => {
  return {
    type,
    data
  };
};
const newCompany = {
  guid,
  rfc,
  name: company.name,
  business_name: company.business_name,
  holder: company.holder,
  clabe,
  role: 'COMPANY',
  user: newUser,
  operation_cost: operationCost
};
const newCompanyCall = {
  guid,
  rfc,
  name: company.name,
  business_name: company.business_name,
  holder: company.holder,
  clabe,
  role: 'COMPANY',
  user: newUser,
  operation_cost: stringOperationCost
};
const companies = [ company ];
const usersList = {
  users: [ {
    name: 'John Doe',
    email: 'john@doe.com',
    color: '#1234',
    status: 'active'
  }, {
    name: 'Jane Doe',
    email: 'jane@doe.com',
    color: '#4321',
    status: 'pending'
  } ]
};
const exists = {
  exists: true
};
const newInvestorCompany = _.cloneDeep(newCompany);
const newInvestor = _.cloneDeep(newUser);

newInvestorCompany.role = 'INVESTOR';
newInvestorCompany.user.type = 'INVESTOR';
newInvestorCompany.operation_cost = operationInvestor_cost;
newInvestorCompany.taxpayer_type = 'moral';
newInvestor.type = 'INVESTOR';

const newInvestorCompanyCall = _.cloneDeep(newInvestorCompany);

newInvestorCompanyCall.operation_cost = stringOperationInvestorCost;

module.exports = {
  create: {
    guid,
    request: {
      guid,
      body: newCompany
    },
    response,
    messageCall: 'Create company',
    responseType: 'response',
    responseError: {
      type: 'Company',
      error: apiCommonError
    },
    errorHelperParams: [
      'Company',
      apiCommonError,
      guid,
      response
    ],
    company,
    responseData: responseData('Company', company),
    sendParams: [ 'company', 'create', newCompanyCall ]
  },
  exists: {
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
    messageCall: 'Company Exists',
    responseType: 'response',
    guid,
    sendParams: [ 'company', 'exists', {
      guid,
      rfc
    } ],
    responseError: {
      type: 'CompanyExists',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'CompanyExists',
      companyNotFoundError,
      guid,
      response
    ],
    exists,
    responseData: responseData('CompanyExists', exists)
  },
  updateCompany: {
    request: {
      guid,
      swagger: {
        params: {
          rfc: {
            value: rfc
          }
        }
      },
      body: {
        name: company.name,
        business_name: company.business_name,
        holder: company.holder,
        clabe
      }
    },
    response,
    messageCall: 'Update company',
    responseType: 'response',
    guid,
    sendParams: [ 'company', 'update', {
      guid,
      rfc,
      name: company.name,
      business_name: company.business_name,
      holder: company.holder,
      clabe
    } ],
    responseError: {
      type: 'Company',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'Company',
      companyNotFoundError,
      guid,
      response
    ],
    company,
    responseData: responseData('Company', company)
  },
  updateCompanyOperationCost: {
    request: {
      guid,
      swagger: {
        params: {
          rfc: {
            value: rfc
          }
        }
      },
      body: {
        operation_cost: {
          annual_cost: operationCost.annual_cost,
          reserve: operationCost.reserve,
          fd_commission: operationCost.fd_commission
        }
      }
    },
    response,
    messageCall: 'Update company operation cost',
    responseType: 'response',
    guid,
    operationCost: {
      annual_cost: operationCost.annual_cost,
      reserve: operationCost.reserve,
      fd_commission: operationCost.fd_commission
    },
    sendParams: [ 'company', 'updateOperationCost', {
      guid,
      rfc,
      annual_cost: operationCost.annual_cost.toFixed(2),
      reserve: operationCost.reserve.toFixed(2),
      fd_commission: operationCost.fd_commission.toFixed(2),
      role: 'COMPANY'
    } ],
    responseError: {
      type: 'OperationCost',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'OperationCost',
      companyNotFoundError,
      guid,
      response
    ],
    responseData: responseData('OperationCost', operationCost)
  },
  updateInvestorOperationCost: {
    request: {
      guid,
      swagger: {
        params: {
          rfc: {
            value: rfc
          }
        }
      },
      body: {
        operation_cost: {
          fee: operationInvestor_cost.fee
        }
      }
    },
    response,
    messageCall: 'Update investor operation cost',
    responseType: 'response',
    guid,
    operationCost: {
      fee: operationInvestor_cost.fee
    },
    sendParams: [ 'company', 'updateOperationCost', {
      guid,
      rfc,
      fee: operationInvestor_cost.fee.toFixed(2),
      role: 'INVESTOR'
    } ],
    responseError: {
      type: 'OperationCost',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'OperationCost',
      companyNotFoundError,
      guid,
      response
    ],
    responseData: responseData('OperationCost', {
      fee: operationInvestor_cost.fee
    })
  },
  getCompany: {
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
    messageCall: 'Get company',
    responseType: 'response',
    guid,
    sendParams: [ 'company', 'getFullInformation', {
      guid,
      rfc
    } ],
    responseError: {
      type: 'Company',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'Company',
      companyNotFoundError,
      guid,
      response
    ],
    company,
    responseData: responseData('Company', company)
  },
  getCompanies: {
    request: {
      guid,
      query: {
        page_size: 2,
        page: 2
      }
    },
    response,
    guid,
    sendParams: [ 'company', 'getCompanies', {
      guid,
      limit: 2,
      offset: 2,
      role: 'COMPANY'
    } ],
    companies,
    messageCall: 'Get companies',
    responseType: 'response',
    responseData: responseData('CompanyList', companies),
    responseError: {
      type: 'CompanyList',
      error: apiCommonError
    },
    errorHelperParams: [
      'CompanyList',
      apiCommonError,
      guid,
      response
    ]
  },
  getInvestorCompanies: {
    request: {
      guid,
      query: {
        page_size: 2,
        page: 2
      }
    },
    response,
    guid,
    sendParams: [ 'company', 'getCompanies', {
      guid,
      limit: 2,
      offset: 2,
      role: 'INVESTOR'
    } ],
    companies,
    messageCall: 'Get investor companies',
    responseType: 'response',
    responseData: responseData('InvestorList', companies),
    responseError: {
      type: 'InvestorList',
      error: apiCommonError
    },
    errorHelperParams: [
      'InvestorList',
      apiCommonError,
      guid,
      response
    ]
  },
  getBankInfo: {
    request: {
      guid,
      swagger: {
        params: {
          clabe: {
            value: clabe
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'company', 'analyzeClabe', {
      guid,
      clabe
    } ],
    bankInfo,
    messageCall: 'Get Bank Info',
    responseType: 'response',
    responseData: responseData('BankInfo', bankInfo),
    responseError: {
      type: 'BankInfo',
      error: apiCommonError
    },
    errorHelperParams: [
      'BankInfo',
      apiCommonError,
      guid,
      response
    ]
  },
  clabeExists: {
    request: {
      guid,
      swagger: {
        params: {
          clabe: {
            value: clabe
          }
        }
      }
    },
    response,
    guid,
    sendParams: [ 'company', 'analyzeClabe', {
      guid,
      clabe,
      exists: true
    } ],
    bankInfo,
    messageCall: 'Get Bank Info By Clabe',
    responseType: 'response',
    responseData: responseData('BankInfo', bankInfo),
    responseError: {
      type: 'BankInfo',
      error: apiCommonError
    },
    errorHelperParams: [
      'BankInfo',
      apiCommonError,
      guid,
      response
    ]
  },
  getCompanyUsers: {
    request: {
      guid,
      swagger: {
        params: {
          rfc: {
            value: rfc
          }
        }
      },
      query: {
        order_by: 'name',
        order_desc: 'false'
      }
    },
    response,
    guid,
    sendParams: [ 'company', 'getUsers', {
      guid,
      rfc
    } ],
    sendParamsWithQuery: [ 'company', 'getUsers', {
      guid,
      rfc,
      order_by: 'name',
      order_desc: false
    } ],
    usersList,
    messageCall: 'Get company users',
    responseType: 'response',
    responseData: responseData('CompanyUsers', usersList),
    responseError: {
      type: 'CompanyUsers',
      error: apiCommonError
    },
    errorHelperParams: [
      'CompanyUsers',
      apiCommonError,
      guid,
      response
    ]
  },
  getCompanyOperationCost: {
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
    messageCall: 'Get Company Operation Costs',
    responseType: 'response',
    guid,
    sendParams: [ 'company', 'getOperationCost', {
      guid,
      rfc,
      role: 'COMPANY'
    } ],
    responseError: {
      type: 'OperationCost',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'OperationCost',
      companyNotFoundError,
      guid,
      response
    ],
    operationCost,
    responseData: responseData('OperationCost', operationCost)
  },
  getInvestorOperationCost: {
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
    messageCall: 'Get Investor Operation Costs',
    responseType: 'response',
    guid,
    sendParams: [ 'company', 'getOperationCost', {
      guid,
      rfc,
      role: 'INVESTOR'
    } ],
    responseError: {
      type: 'OperationCost',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'OperationCost',
      companyNotFoundError,
      guid,
      response
    ],
    operationInvestorCost: operationInvestor_cost,
    responseData: responseData('OperationCost', operationInvestor_cost)
  },
  addUser: {
    request: {
      guid,
      body: newUser,
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
    sendParams: [ 'company', 'addUser', {
      guid,
      company_rfc: rfc,
      user: newUser
    } ],
    userInfo: newUser,
    messageCall: 'Add user to company',
    responseType: 'response',
    responseData: responseData('User', newUser),
    responseError: {
      type: 'User',
      error: apiCommonError
    },
    errorHelperParams: [
      'User',
      apiCommonError,
      guid,
      response
    ]
  },
  createInvestor: {
    guid,
    request: {
      guid,
      body: newInvestorCompany
    },
    response,
    messageCall: 'Create investor company',
    responseType: 'response',
    responseError: {
      type: 'Investor',
      error: apiCommonError
    },
    errorHelperParams: [
      'Investor',
      apiCommonError,
      guid,
      response
    ],
    company,
    responseData: responseData('Investor', company),
    sendParams: [ 'company', 'create', newInvestorCompanyCall ]
  },
  addInvestorUser: {
    request: {
      guid,
      body: newInvestor,
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
    sendParams: [ 'company', 'addUser', {
      guid,
      company_rfc: rfc,
      user: newInvestor
    } ],
    userInfo: newInvestor,
    messageCall: 'Add user to company',
    responseType: 'response',
    responseData: responseData('Investor', newInvestor),
    responseError: {
      type: 'Investor',
      error: apiCommonError
    },
    errorHelperParams: [
      'Investor',
      apiCommonError,
      guid,
      response
    ]
  },
  getBalance: {
    request: {
      guid,
      swagger: {
        params: {
          rfc: {
            value: rfc
          }
        }
      },
      user: {
        user_id: 1
      }
    },
    response,
    messageCall: 'Get company balance',
    responseType: 'response',
    guid,
    sendParams: [ 'company', 'getBalance', {
      guid,
      rfc,
      user_id: 1
    } ],
    responseError: {
      type: 'Balance',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'Balance',
      companyNotFoundError,
      guid,
      response
    ],
    balance: {
      total: '100'
    },
    responseData: responseData('Balance', {
      total: 100
    })
  },
  updateCompanyRoleSuspension: {
    request: {
      guid,
      swagger: {
        params: {
          rfc: {
            value: rfc
          }
        }
      },
      user: {
        user_id: 1
      },
      body: {
        role: 'cxc',
        suspended: true
      }
    },
    response,
    messageCall: 'Update company role suspension',
    responseType: 'response',
    guid,
    sendParams: [ 'company', 'updateCompanyRoleSuspension', {
      guid,
      rfc,
      role: 'CXC',
      suspended: true
    } ],
    responseError: {
      type: 'Role',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'Role',
      companyNotFoundError,
      guid,
      response
    ],
    responseData: responseData('Role', {
      success: true
    })
  },
  updateInvestorRoleSuspension: {
    request: {
      guid,
      swagger: {
        params: {
          rfc: {
            value: rfc
          }
        }
      },
      user: {
        user_id: 1
      },
      body: {
        role: 'investor',
        suspended: true
      }
    },
    response,
    messageCall: 'Update investor role suspension',
    responseType: 'response',
    guid,
    sendParams: [ 'company', 'updateInvestorRoleSuspension', {
      guid,
      rfc,
      role: 'INVESTOR',
      suspended: true
    } ],
    responseError: {
      type: 'Role',
      error: companyNotFoundError
    },
    errorHelperParams: [
      'Role',
      companyNotFoundError,
      guid,
      response
    ],
    responseData: responseData('Role', {
      success: true
    })
  },
  propose: {
    request: {
      guid,
      user: {
        company_rfc: rfc
      },
      body: {
        business_name: 'business_name',
        type: 'Proveedor',
        contact_name: 'contact_name',
        position: 'position',
        email: 'email',
        phone: 'phone'
      }
    },
    response,
    messageCall: 'Propose a company',
    responseType: 'response',
    success: {
      success: true
    },
    guid,
    sendParams: [ 'company', 'propose', {
      guid,
      company_rfc: rfc,
      business_name: 'business_name',
      type: 'Proveedor',
      contact_name: 'contact_name',
      position: 'position',
      email: 'email',
      phone: 'phone'
    } ],
    responseError: {
      type: 'Company',
      error: apiCommonError
    },
    errorHelperParams: [
      'Company',
      apiCommonError,
      guid,
      response
    ],
    responseData: responseData('Company', {
      success: true
    })
  }
};
