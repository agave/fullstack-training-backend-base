const _ = require('lodash');
const factory = require('../factories/company');
const companyFixtures = require('/var/lib/core/integration_fixtures/company');
const transactionFixtures = require('/var/lib/core/integration_fixtures/pendingTransaction');
const existingUser = require('../fixtures/session').credential();
const user = {
  name: 'John Doe',
  email: 'john@fondeodirecto.com',
  type: 'cxc'
};
const operationCost = {
  fd_commission: 1,
  reserve: 3,
  annual_cost: 2
};
const investorOperationCost = {
  fee: 4
};
const companyData = {
  rfc: 'AAZJ871049067',
  name: 'Alcorp',
  business_name: 'Albert Corporation',
  holder: 'Albert Anstein',
  clabe: '002090700355936432',
  user,
  operation_cost: operationCost
};

class CompanyFixtures {
  validRfc() {
    return 'FODA900806965';
  }

  invalidRfc() {
    return 'CUPU800825569';
  }

  validClabe() {
    return '002090700355936431';
  }

  invalidClabe() {
    return '0355936221';
  }

  companyFactory(remove) {
    const data = _.omit(companyData, remove);

    return factory.createCompany(data);
  }

  longCompanyRfc() {
    const data = _.clone(companyData);

    data.rfc = 'ASDASDASDASDASDASDSADS';
    return factory.createCompany(data);
  }

  shortCompanyRfc() {
    const data = _.clone(companyData);

    data.rfc = 'ASDASDA';
    return factory.createCompany(data);
  }

  companyFactoryWrongRfc() {
    const data = _.clone(user);

    data.rfc = 'AAZJ87112130000';

    return data;
  }

  validName() {
    return {
      rfc: 'BRHY77118049069',
      name: 'Alcorp2'
    };
  }

  validBusinessName() {
    return {
      rfc: 'BRHY77118049069',
      business_name: 'Albert Corporation2'
    };
  }

  validHolder() {
    return {
      rfc: 'BRHY77118049069',
      holder: 'Albert Anstein2'
    };
  }

  validClabeValue() {
    return {
      rfc: 'BRHY77118049069',
      clabe: '002090700352636131'
    };
  }

  validCompanyRfc() {
    return _.find(companyFixtures, { name: 'Voratak' }).rfc;
  }

  operationCosts() {
    return operationCost;
  }

  investorOperationCosts() {
    return investorOperationCost;
  }

  companyOperationCost(remove) {
    const data = _.omit(operationCost, remove);

    return { operation_cost: data };
  }

  investorOperationCost(remove) {
    const data = _.omit(investorOperationCost, remove);

    return { operation_cost: data };
  }

  validInvestorRfc() {
    return _.find(companyFixtures, { name: 'Nexgene' }).rfc;
  }

  validXmlRecipientRfc() {
    return _.find(companyFixtures, { name: 'Recipient company' }).rfc;
  }

  companyFactoryWithDecimal(remove) {
    companyData.rfc = 'AAZJ871139262';
    companyData.user.email = 'johndoe2@fondeodirecto.com';
    companyData.clabe = '002090700755116021';
    companyData.operation_cost.fd_commission = 3.1;
    const data = _.omit(companyData, remove);

    return factory.createCompany(data);
  }

  investorCompanyFactory(remove) {
    companyData.rfc = 'AAZJ871049066';
    companyData.user.email = 'johndoe3@fondeodirecto.com';
    companyData.clabe = '002090700355336121';
    companyData.operation_cost.fee = 5;
    companyData.taxpayer_type = 'moral';

    const data = _.omit(companyData, remove);

    return factory.createCompany(data);
  }

  investorCompanyWithDecimal(remove) {
    companyData.rfc = 'AAZJ871049056';
    companyData.user.email = 'johndoe4@fondeodirecto.com';
    companyData.clabe = '002090700355216121';
    companyData.operation_cost.fee = 5.3;
    const data = _.omit(companyData, remove);

    return factory.createCompany(data);
  }

  validCompanyWithInvitations() {
    return _.find(companyFixtures, { name: 'CompanyUsersInvitations' }).rfc;
  }

  validCompanyWithInvitationsAndUsers() {
    return _.find(companyFixtures, { name: 'CompanyUsers' }).rfc;
  }

  validCompanyWithBalanceNoPendingWithdraw() {
    return _.find(companyFixtures, { name: 'Zum Zum' });
  }

  validCompanyWithBalancePendingWithdraw() {
    const company = _.find(companyFixtures, { name: 'Dogtown' });
    const transactions = _.filter(transactionFixtures, {
      company_rfc: company.rfc,
      type: 'WITHDRAW',
      status: 'PENDING'
    });

    company.transactions = transactions;

    return company;
  }

  validInvestorWithPendingTransactions() {
    const company = _.find(companyFixtures, { name: 'Dogtown' });
    const transactions = _.filter(transactionFixtures, {
      company_rfc: company.rfc,
      status: 'PENDING'
    });

    company.transactions = transactions;

    return company;
  }

  validCompanyWithPendingTransactions() {
    const company = _.find(companyFixtures, { name: 'Namebox' });
    const transactions = _.filter(transactionFixtures, {
      company_rfc: company.rfc,
      status: 'PENDING'
    });

    company.transactions = transactions;

    return company;
  }

  validInvestorRfcWithBalance() {
    return _.find(companyFixtures, { name: 'Zum Zum' }).rfc;
  }

  validInvestorRfcWithBalanceAndPendingTransacitons() {
    return _.find(companyFixtures, { name: 'ERNG' }).rfc;
  }

  notUniqueClabe() {
    return _.find(companyFixtures, { name: 'Test Directo' }).clabe;
  }

  userUniqueFactory(remove) {
    let data = _.clone(user);

    data.email = 'reallyreallyuniqueemail@fondeodirecto.com';
    data = _.omit(data, remove);

    return factory.createUser(data);
  }

  investorUniqueFactory(remove) {
    let data = _.clone(user);

    data.email = 'reallyreallyuniqueinvestoremail@fondeodirecto.com';
    data = _.omit(data, remove);
    delete data.type;

    return factory.createUser(data);
  }

  validCompanyToAddUser() {
    return _.find(companyFixtures, { name: 'AddUserToCompany' }).rfc;
  }

  validCompanyToAddInvestor() {
    return _.find(companyFixtures, { name: 'AddInvestorToCompany' }).rfc;
  }

  existingUser() {
    const data = {
      email: existingUser.email,
      name: 'Existing John',
      type: 'cxc'
    };

    return factory.createUser(data);
  }

  noSuspensionsCompany() {
    return _.find(companyFixtures, { name: 'No suspensions' });
  }

  suspendedCXCCompany() {
    return _.find(companyFixtures, { name: 'Suspended CXC' });
  }

  suspendCXCRole() {
    return {
      role: 'CXC',
      suspended: true
    };
  }

  unsuspendCXCRole() {
    return {
      role: 'CXC',
      suspended: false
    };
  }

  suspendCXPRole() {
    return {
      role: 'CXP',
      suspended: true
    };
  }

  unsuspendCXPRole() {
    return {
      role: 'CXP',
      suspended: false
    };
  }

  invalidSuspendRole() {
    return {
      role: 'CXX',
      suspended: true
    };
  }

  noSuspensionsInvestor() {
    return _.find(companyFixtures, { name: 'No suspensions INVESTOR' });
  }

  suspendedInvestor() {
    return _.find(companyFixtures, { name: 'Suspended INVESTOR' });
  }

  suspendInvestorRole() {
    return {
      role: 'INVESTOR',
      suspended: true
    };
  }

  unsuspendInvestorRole() {
    return {
      role: 'INVESTOR',
      suspended: false
    };
  }

  proposeCompany(remove) {
    const propose = {
      business_name: 'business_name',
      type: 'Proveedor',
      contact_name: 'contact_name',
      position: 'position',
      email: 'email',
      phone: 'phone'
    };

    const data = _.omit(propose, remove);

    return data;
  }
}

module.exports = new CompanyFixtures();
