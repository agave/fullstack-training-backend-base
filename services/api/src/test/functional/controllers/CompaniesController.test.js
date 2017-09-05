const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const API = require('../helpers/api');
const _ = require('lodash');
const validate = require('../helpers/validate');
const consumer = require('../helpers/consumer');

const errorCodes = require('../../../config/error-codes');
const fixtures = require('../fixtures/company');

const companySchema = require('../schemas/company');
const companyInvestorSchema = require('../schemas/companyInvestor');
const companiesSchema = require('../schemas/companies');
const companyUsersSchema = require('../schemas/company-users');
const newCompanyUserSchema = require('../schemas/new-company-user');
const bankInfoSchema = require('../schemas/bankInfo');
const invitationCreatedSchema = require('../schemas/events/invitation-created');
const companyOperationCostSchema = require('../schemas/companyOperationCost');
const investorOperationCostSchema = require('../schemas/investorOperationCost');
const companyRoleSuspensionUpdated = require('../schemas/events/company-role-suspension-updated');
const investorRoleSuspensionUpdated = require('../schemas/events/investor-role-suspension-updated');
const proposedCompany = require('../schemas/events/proposed-company');
const existsSchema = require('../schemas/exists');
const balanceSchema = require('../schemas/balance');
const errorSchema = require('../schemas/error');
const successSchema = require('../schemas/success');

chai.should();
chai.use(chaiAsPromised);

describe('functional/Companies controller', () => {

  beforeEach(() => {
    if (!API.isLoggedIn()) {
      return API.login();
    }

    return Promise.resolve();
  });

  describe('create', () => {

    it('should return error if not authenticated', function() {
      const company = fixtures.companyFactory();

      return API.logout()
      .then(() => API.createCompany(company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const company = fixtures.companyFactory();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.createCompany(company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const company = fixtures.companyFactory();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.createCompany(company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const company = fixtures.companyFactory();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.createCompany(company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if rfc is not included', () => {
      const company = fixtures.companyFactory([ 'rfc' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('rfc');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if rfc is not unique', () => {
      const company = fixtures.companyFactory([ 'rfc' ]);

      company.rfc = fixtures.validRfc();

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('rfc');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if name is not included', () => {
      const company = fixtures.companyFactory([ 'name' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('name');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if business_name is not included', () => {
      const company = fixtures.companyFactory([ 'business_name' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('business_name');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if clabe is not included', () => {
      const company = fixtures.companyFactory([ 'clabe' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('clabe');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if clabe is not the correct format', () => {
      const company = fixtures.companyFactory();

      company.clabe = fixtures.invalidClabe();

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('clabe');
        errorData.error.code.should.be.eql(errorCodes.Company[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if clabe is not unique', () => {
      const company = fixtures.companyFactory();

      company.clabe = fixtures.notUniqueClabe();

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('clabe');
        errorData.error.code.should.be.eql(errorCodes.Company[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user name is not included', () => {
      const company = fixtures.companyFactory([ 'user.name' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {
        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('user.name');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user type is not included', () => {
      const company = fixtures.companyFactory([ 'user.type' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('user.type');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user type is not allowed', () => {
      const company = fixtures.companyFactory([ 'user.type' ]);

      company.user.type = 'ADMIN';

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('user.type');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user email is not included', () => {
      const company = fixtures.companyFactory([ 'user.email' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('user.email');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user email is not email format', () => {
      const company = fixtures.companyFactory();

      company.user.email = 'johndoe.com';

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('email');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user already is a member of a company', () => {
      const company = fixtures.companyFactory();
      const user = fixtures.existingUser();

      company.user.email = user.email;

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('email');
        errorData.error.data.company_name.should.be.equal('Fondeo Directo');
        errorData.error.code.should.be.eql(errorCodes.Company[errorData.error.message]);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if anual_cost is not included', () => {
      const company = fixtures.companyFactory([ 'operation_cost.annual_cost' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('operation_cost.annual_cost');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if reserve is not included', () => {
      const company = fixtures.companyFactory([ 'operation_cost.reserve' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('operation_cost.reserve');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if fd_commission is not included', () => {
      const company = fixtures.companyFactory([ 'operation_cost.fd_commission' ]);

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('operation_cost.fd_commission');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if anual_cost is negative', () => {
      const company = fixtures.companyFactory([ 'operation_cost.annual_cost' ]);

      company.operation_cost.annual_cost = -1;

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('operation_cost.annual_cost');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if reserve is negative', () => {
      const company = fixtures.companyFactory([ 'operation_cost.reserve' ]);

      company.operation_cost.reserve = -1;

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('operation_cost.reserve');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if fd_commission is negative', () => {
      const company = fixtures.companyFactory([ 'operation_cost.fd_commission' ]);

      company.operation_cost.fd_commission = -1;

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('operation_cost.fd_commission');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a company object if there was no issue with the information', () => {
      const company = fixtures.companyFactory();

      return API.createCompany(company)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');
        return consumer.getNextEvent()
        .then(validate(invitationCreatedSchema))
        .then(validate(companySchema)(responseData.data));
      });
    });

    it('should return an error if rfc is to long', () => {
      const company = fixtures.longCompanyRfc();

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {
        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('rfc');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if rfc is short', () => {
      const company = fixtures.shortCompanyRfc();

      return API.createCompany(company)
      .should.be.fulfilled
      .then(error => {
        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('rfc');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a company object if there was no issue with the information even though are decimals', () => {
      const company = fixtures.companyFactoryWithDecimal();

      return API.createCompany(company)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');
        return consumer.getNextEvent()
        .then(validate(invitationCreatedSchema))
        .then(validate(companySchema)(responseData.data));
      });
    });
  });

  describe('exists', () => {

    it('should return error if not authenticated', function() {
      const rfc = fixtures.validRfc();

      return API.logout()
      .then(() => API.companyExists(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const rfc = fixtures.validRfc();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.companyExists(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const rfc = fixtures.validRfc();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.companyExists(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const rfc = fixtures.validRfc();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.companyExists(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return a exists object false if the company does not exists', () => {
      const rfc = fixtures.invalidRfc();

      return API.companyExists(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyExists');

        return validate(existsSchema)(responseData.data);
      });
    });

    it('should return a exists object if the company exists', () => {
      const rfc = fixtures.validRfc();

      return API.companyExists(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyExists');

        return validate(existsSchema)(responseData.data);
      });
    });
  });

  describe('update', () => {

    it('should return error if not authenticated', function() {
      const company = fixtures.companyFactory();

      return API.logout()
      .then(() => API.updateCompany(company.rfc, company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const company = fixtures.companyFactory();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.updateCompany(company.rfc, company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const company = fixtures.companyFactory();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.updateCompany(company.rfc, company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const company = fixtures.companyFactory();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.updateCompany(company.rfc, company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if rfc does not exists', () => {
      const company = fixtures.companyFactoryWrongRfc();

      return API.updateCompany(company.rfc, company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Company');
        errorData.error.path.should.be.equal('company');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a company object updated with the new name', () => {
      const company = fixtures.validName();

      return API.updateCompany(company.rfc, company)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');
        responseData.data.name.should.be.equal(company.name);

        return validate(companySchema)(responseData.data);
      });
    });

    it('should return a company object updated with the new business name', () => {
      const company = fixtures.validBusinessName();

      return API.updateCompany(company.rfc, company)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');
        responseData.data.business_name.should.be.equal(company.business_name);

        return validate(companySchema)(responseData.data);
      });
    });

    it('should return a company object updated with the new holder value', () => {
      const company = fixtures.validHolder();

      return API.updateCompany(company.rfc, company)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');
        responseData.data.holder.should.be.equal(company.holder);

        return validate(companySchema)(responseData.data);
      });
    });

    it('should return a company object updated with the new clabe value', () => {
      const company = fixtures.validClabeValue();

      return API.updateCompany(company.rfc, company)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');
        responseData.data.clabe.should.be.equal(company.clabe);

        return validate(companySchema)(responseData.data);
      });
    });
  });

  describe('updateCompanyOperationCost', () => {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.updateCompanyOperationCost())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.updateCompanyOperationCost())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.updateCompanyOperationCost())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.updateCompanyOperationCost())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the company doesn\‘t have the same company role as you requested', () => {
      const rfc = fixtures.validInvestorRfc();
      const operationCost = fixtures.companyOperationCost();

      return API.updateCompanyOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('company');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the company doesn\'t exists', () => {
      const rfc = fixtures.invalidRfc();
      const operationCost = fixtures.companyOperationCost();

      return API.updateCompanyOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('company');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if annual_cost is not present', () => {
      const rfc = fixtures.validCompanyRfc();
      const operationCost = fixtures.companyOperationCost([ 'annual_cost' ]);

      return API.updateCompanyOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('operation_cost.annual_cost');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if reserve is not present', () => {
      const rfc = fixtures.validCompanyRfc();
      const operationCost = fixtures.companyOperationCost([ 'reserve' ]);

      return API.updateCompanyOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('operation_cost.reserve');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if fd_commission is not present', () => {
      const rfc = fixtures.validCompanyRfc();
      const operationCost = fixtures.companyOperationCost([ 'fd_commission' ]);

      return API.updateCompanyOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('operation_cost.fd_commission');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if annual_cost is negative', () => {
      const rfc = fixtures.validCompanyRfc();
      const operationCost = fixtures.companyOperationCost([ 'annual_cost' ]);

      operationCost.annual_cost = -1;

      return API.updateCompanyOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('operation_cost.annual_cost');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if reserve is negative', () => {
      const rfc = fixtures.validCompanyRfc();
      const operationCost = fixtures.companyOperationCost([ 'reserve' ]);

      operationCost.reserve = -1;

      return API.updateCompanyOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('operation_cost.reserve');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if fd_commission is negative', () => {
      const rfc = fixtures.validCompanyRfc();
      const operationCost = fixtures.companyOperationCost([ 'fd_commission' ]);

      operationCost.fd_commission = -1;

      return API.updateCompanyOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('operation_cost.fd_commission');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return the operation costs', () => {
      const rfc = fixtures.validCompanyRfc();
      const operationCost = fixtures.companyOperationCost();
      const result = fixtures.operationCosts();

      return API.updateCompanyOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.data.annual_cost.should.be.equal(result.annual_cost);
        responseData.data.reserve.should.be.equal(result.reserve);
        responseData.data.fd_commission.should.be.equal(result.fd_commission);

        return validate(companyOperationCostSchema)(responseData.data);
      });
    });
  });

  describe('updateInvestorOperationCost', () => {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.updateInvestorOperationCost())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.updateInvestorOperationCost())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.updateInvestorOperationCost())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.updateInvestorOperationCost())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the company doesn\‘t have the same company role as you requested', () => {
      const rfc = fixtures.validCompanyRfc();
      const operationCost = fixtures.investorOperationCost();

      return API.updateInvestorOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('company');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the company doesn\'t exists', () => {
      const rfc = fixtures.invalidRfc();
      const operationCost = fixtures.investorOperationCost();

      return API.updateInvestorOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('company');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if fee is not present', () => {
      const rfc = fixtures.validInvestorRfc();
      const operationCost = fixtures.investorOperationCost([ 'fee' ]);

      return API.updateInvestorOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('operation_cost.fee');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if fee is negative', () => {
      const rfc = fixtures.validInvestorRfc();
      const operationCost = fixtures.investorOperationCost([ 'fee' ]);

      operationCost.fee = -1;

      return API.updateInvestorOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.path.should.be.equal('operation_cost.fee');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return the operation costs', () => {
      const rfc = fixtures.validInvestorRfc();
      const operationCost = fixtures.investorOperationCost();
      const result = fixtures.investorOperationCosts();

      return API.updateInvestorOperationCost(rfc, operationCost)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.data.fee.should.be.equal(result.fee);

        return validate(investorOperationCostSchema)(responseData.data);
      });
    });
  });

  describe('getCompany', () => {

    it('should return error if not authenticated', function() {
      const rfc = fixtures.invalidRfc();

      return API.logout()
      .then(() => API.getCompany(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const rfc = fixtures.invalidRfc();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getCompany(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const rfc = fixtures.invalidRfc();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getCompany(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const rfc = fixtures.invalidRfc();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getCompany(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the company doesn\'t exists', () => {
      const rfc = fixtures.invalidRfc();

      return API.getCompany(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return a full company if the company exists', () => {
      const rfc = fixtures.validRfc();

      return API.getCompany(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');

        return validate(companySchema)(responseData.data);
      });
    });

    it('should return a full investor company if the company exists', () => {
      const rfc = fixtures.validInvestorRfc();

      return API.getCompany(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');

        return validate(companyInvestorSchema)(responseData.data);
      });
    });
  });

  describe('getCompanies', () => {
    let totalCompanies = 0;
    let companiesList = {};

    before(() => {
      return API.login()
      .then(() => {
        return API.getCompanies(100);
      })
      .then(response => {
        const responseData = response.data;

        totalCompanies = responseData.data.total_companies;
        companiesList = _.sortBy(responseData.data.companies, [ 'name' ]);
      });
    });

    it('should return error if not authenticated', function() {

      return API.logout()
      .then(() => API.getCompanies())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getCompanies())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getCompanies())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getCompanies())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an array of companies with page_size limits', () => {
      return API.getCompanies(2, 0)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyList');
        responseData.data.companies.length.should.be.equal(2);
        responseData.data.total_companies.should.be.equal(totalCompanies);

        return validate(companiesSchema)(responseData.data);
      });
    });

    it('should return an error if page_size has an invalid value', () => {
      return API.getCompanies(-2, 0, 'name')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyList');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page has an invalid value', () => {
      return API.getCompanies(2, -1, 'name')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyList');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if order_by has an invalid value', () => {
      return API.getCompanies(2, 0, 'email')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyList');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the order_desc field isn\'t allowed', () => {
      const rfc = fixtures.validCompanyWithInvitationsAndUsers();

      return API.getCompanyUsers(rfc, 'email', 'something')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyUsers');
        responseData.error.path.should.be.equal('order_desc');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of companies with companies ordered', () => {
      return API.getCompanies(2, 0, 'name', false)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyList');
        responseData.data.companies.length.should.be.equal(2);
        responseData.data.companies[0].name.should.be.equal(companiesList[0].name);
        responseData.data.companies[1].name.should.be.equal(companiesList[1].name);
        responseData.data.total_companies.should.be.equal(totalCompanies);

        return validate(companiesSchema)(responseData.data);
      });
    });

    it('should return an array of companies with companies ordered and desc', () => {
      return API.getCompanies(2, 0, 'name', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;
        const length = companiesList.length;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyList');
        responseData.data.companies.length.should.be.equal(2);
        responseData.data.companies[0].name.should.be.equal(companiesList[length - 1].name);
        responseData.data.companies[1].name.should.be.equal(companiesList[length - 2].name);
        responseData.data.total_companies.should.be.equal(totalCompanies);

        return validate(companiesSchema)(responseData.data);
      });
    });

    it('should return an array of companies', () => {
      return API.getCompanies()
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyList');
        responseData.data.companies.length.should.be.not.equal(0);

        return validate(companiesSchema)(responseData.data);
      });
    });
  });

  describe('getInvestorCompanies', () => {
    let totalCompanies = 0;
    let companiesList = {};

    before(() => {
      return API.login()
      .then(() => {
        return API.getInvestorCompanies(100);
      })
      .then(response => {
        const responseData = response.data;

        totalCompanies = responseData.data.total_companies;
        companiesList = _.sortBy(responseData.data.companies, [ 'name' ]);
      });
    });

    it('should return error if not authenticated', function() {

      return API.logout()
      .then(() => API.getInvestorCompanies())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getInvestorCompanies())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getInvestorCompanies())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvestorCompanies())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an array of companies with page_size limits', () => {
      return API.getInvestorCompanies(2, 0)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvestorList');
        responseData.data.companies.length.should.be.equal(2);
        responseData.data.total_companies.should.be.equal(totalCompanies);

        return validate(companiesSchema)(responseData.data);
      });
    });

    it('should return an error if page_size has an invalid value', () => {
      return API.getInvestorCompanies(-2, 0, 'name')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvestorList');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if page has an invalid value', () => {
      return API.getInvestorCompanies(2, -1, 'name')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvestorList');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if order_by has an invalid value', () => {
      return API.getInvestorCompanies(2, 0, 'email')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvestorList');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the order_desc field isn\'t allowed', () => {
      return API.getInvestorCompanies(100, 0, 'user_count', 'something')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvestorList');
        responseData.error.path.should.be.equal('order_desc');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an array of companies with companies ordered', () => {
      return API.getInvestorCompanies(2, 0, 'name', false)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvestorList');
        responseData.data.companies.length.should.be.equal(2);
        responseData.data.companies[0].name.should.be.equal(companiesList[0].name);
        responseData.data.companies[1].name.should.be.equal(companiesList[1].name);
        responseData.data.total_companies.should.be.equal(totalCompanies);

        return validate(companiesSchema)(responseData.data);
      });
    });

    it('should return an array of companies with companies ordered and desc', () => {
      return API.getInvestorCompanies(2, 0, 'name', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;
        const length = companiesList.length;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvestorList');
        responseData.data.companies.length.should.be.equal(2);
        responseData.data.companies[0].name.should.be.equal(companiesList[length - 1].name);
        responseData.data.companies[1].name.should.be.equal(companiesList[length - 2].name);
        responseData.data.total_companies.should.be.equal(totalCompanies);

        return validate(companiesSchema)(responseData.data);
      });
    });

    it('should return an array of companies', () => {
      return API.getInvestorCompanies()
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('InvestorList');
        responseData.data.companies.length.should.be.not.equal(0);

        return validate(companiesSchema)(responseData.data);
      });
    });
  });

  describe('getBankInfo', () => {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.getBankInfo())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getBankInfo())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getBankInfo())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getBankInfo())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the clabe is invalid', () => {
      const clabe = fixtures.invalidClabe();

      return API.getBankInfo(clabe)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('BankInfo');
        responseData.error.code.should.be.eql(errorCodes.BankInfo[responseData.error.message]);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return a bankInfo if the clabe is valid even though it belongs to a company', () => {
      const clabe = fixtures.notUniqueClabe();

      return API.getBankInfo(clabe)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('BankInfo');

        return validate(bankInfoSchema)(responseData.data);
      });
    });

    it('should return a bankInfo if the clabe is valid', () => {
      const clabe = fixtures.validClabe();

      return API.getBankInfo(clabe)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('BankInfo');

        return validate(bankInfoSchema)(responseData.data);
      });
    });
  });

  describe('clabeExists', () => {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.getBankInfoByClabe())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getBankInfoByClabe())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getBankInfoByClabe())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getBankInfoByClabe())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the clabe is invalid', () => {
      const clabe = fixtures.invalidClabe();

      return API.getBankInfoByClabe(clabe)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('BankInfo');
        responseData.error.code.should.be.eql(errorCodes.BankInfo[responseData.error.message]);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the clabe is related to another company', () => {
      const clabe = fixtures.notUniqueClabe();

      return API.getBankInfoByClabe(clabe)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('BankInfo');
        responseData.error.code.should.be.eql(errorCodes.BankInfo[responseData.error.message]);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return a bankInfo if the clabe is valid', () => {
      const clabe = fixtures.validClabe();

      return API.getBankInfoByClabe(clabe)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('BankInfo');

        return validate(bankInfoSchema)(responseData.data);
      });
    });
  });

  describe('getCompanyUsers', () => {

    it('should return error if not authenticated', function() {
      return API.logout()
      .then(() => API.getCompanyUsers())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getCompanyUsers())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getCompanyUsers())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getCompanyUsers())
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the company doesn\'t exists', () => {
      const rfc = fixtures.invalidRfc();

      return API.getCompanyUsers(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyUsers');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return a company users with only invitations', () => {
      const rfc = fixtures.validCompanyWithInvitations();

      return API.getCompanyUsers(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyUsers');
        responseData.data.users.length.should.be.eql(1);

        return validate(companyUsersSchema)(responseData.data);
      });
    });

    it('should return a complete company users', () => {
      const rfc = fixtures.validCompanyWithInvitationsAndUsers();

      return API.getCompanyUsers(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyUsers');
        responseData.data.users.length.should.be.eql(2);

        return validate(companyUsersSchema)(responseData.data);
      });
    });

    it('should return an error if the order_by field isn\'t allowed', () => {
      const rfc = fixtures.validCompanyWithInvitationsAndUsers();

      return API.getCompanyUsers(rfc, 'id', false)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyUsers');
        responseData.error.path.should.be.equal('order_by');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the order_desc field isn\'t allowed', () => {
      const rfc = fixtures.validCompanyWithInvitationsAndUsers();

      return API.getCompanyUsers(rfc, 'name', 'something')
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyUsers');
        responseData.error.path.should.be.equal('order_desc');
        responseData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return a list ordered by name', () => {
      const rfc = fixtures.validCompanyWithInvitationsAndUsers();

      return API.getCompanyUsers(rfc, 'name', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyUsers');
        responseData.data.users.length.should.be.eql(2);
        responseData.data.users[0].email.should.be.eql('invitation@fondeodirecto.com');

        return validate(companyUsersSchema)(responseData.data);
      });
    });

    it('should return a list ordered by email', () => {
      const rfc = fixtures.validCompanyWithInvitationsAndUsers();

      return API.getCompanyUsers(rfc, 'email', false)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyUsers');
        responseData.data.users.length.should.be.eql(2);
        responseData.data.users[0].email.should.be.eql('company@fondeodirecto.com');

        return validate(companyUsersSchema)(responseData.data);
      });
    });

    it('should return a list ordered by status', () => {
      const rfc = fixtures.validCompanyWithInvitationsAndUsers();

      return API.getCompanyUsers(rfc, 'status', true)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('CompanyUsers');
        responseData.data.users.length.should.be.eql(2);
        responseData.data.users[0].email.should.be.eql('invitation@fondeodirecto.com');

        return validate(companyUsersSchema)(responseData.data);
      });
    });
  });

  describe('getCompanyOperationCost', () => {

    it('should return error if not authenticated', function() {
      const rfc = fixtures.validInvestorRfc();

      return API.logout()
      .then(() => API.getOperationCost(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const rfc = fixtures.validInvestorRfc();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getOperationCost(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const rfc = fixtures.validInvestorRfc();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getOperationCost(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const rfc = fixtures.validInvestorRfc();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getOperationCost(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the company doesn\‘t have the same company role as you requested', () => {
      const rfc = fixtures.validInvestorRfc();

      return API.getOperationCost(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the company doesn\'t exists', () => {
      const rfc = fixtures.invalidRfc();

      return API.getOperationCost(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return the operation costs', () => {
      const rfc = fixtures.validCompanyRfc();

      return API.getOperationCost(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');

        return validate(companyOperationCostSchema)(responseData.data);
      });
    });
  });

  describe('getInvestorOperationCost', () => {

    it('should return error if not authenticated', function() {
      const rfc = fixtures.validInvestorRfc();

      return API.logout()
      .then(() => API.getInvestorOperationCost(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const rfc = fixtures.validInvestorRfc();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getInvestorOperationCost(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const rfc = fixtures.validInvestorRfc();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getInvestorOperationCost(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const rfc = fixtures.validInvestorRfc();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getInvestorOperationCost(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the company doesn\‘t have the same company role as you requested', () => {
      const rfc = fixtures.validCompanyRfc();

      return API.getInvestorOperationCost(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return an error if the company doesn\'t exists', () => {
      const rfc = fixtures.invalidRfc();

      return API.getInvestorOperationCost(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');
        responseData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(responseData.error);
      });
    });

    it('should return the operation costs', () => {
      const rfc = fixtures.validInvestorRfc();

      return API.getInvestorOperationCost(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('OperationCost');

        return validate(investorOperationCostSchema)(responseData.data);
      });
    });
  });

  describe('addUser', () => {

    it('should return error if not authenticated', function() {
      const rfc = fixtures.validCompanyToAddUser();
      const user = fixtures.userUniqueFactory();

      return API.logout()
      .then(() => API.addUser(rfc, user))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const rfc = fixtures.validCompanyToAddUser();
      const user = fixtures.userUniqueFactory();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.addUser(rfc, user))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const rfc = fixtures.validCompanyToAddUser();
      const user = fixtures.userUniqueFactory();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.addUser(rfc, user))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const rfc = fixtures.validCompanyToAddUser();
      const user = fixtures.userUniqueFactory();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.addUser(rfc, user))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the company doesn\'t exists', () => {
      const rfc = fixtures.invalidRfc();
      const user = fixtures.userUniqueFactory();

      return API.addUser(rfc, user)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('User');
        errorData.error.path.should.be.equal('company');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if name is not included', () => {
      const rfc = fixtures.validCompanyToAddUser();
      const user = fixtures.userUniqueFactory([ 'name' ]);

      return API.addUser(rfc, user)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('User');
        errorData.error.path.should.be.equal('name');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if email is not included', () => {
      const rfc = fixtures.validCompanyToAddUser();
      const user = fixtures.userUniqueFactory([ 'email' ]);

      return API.addUser(rfc, user)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('User');
        errorData.error.path.should.be.equal('email');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if type is not included', () => {
      const rfc = fixtures.validCompanyToAddUser();
      const user = fixtures.userUniqueFactory([ 'type' ]);

      return API.addUser(rfc, user)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('User');
        errorData.error.path.should.be.equal('type');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user already is a member of a company', () => {
      const rfc = fixtures.validCompanyToAddUser();
      const user = fixtures.existingUser();

      return API.addUser(rfc, user)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('User');
        errorData.error.path.should.be.equal('email');
        errorData.error.data.company_name.should.be.equal('Fondeo Directo');
        errorData.error.code.should.be.eql(errorCodes.User[errorData.error.message]);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a new user structure', () => {
      const rfc = fixtures.validCompanyToAddUser();
      const user = fixtures.userUniqueFactory();

      return API.addUser(rfc, user)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('User');
        return consumer.getNextEvent()
        .then(validate(invitationCreatedSchema))
        .then(validate(newCompanyUserSchema)(responseData.data));
      });
    });
  });

  describe('createInvestor', () => {

    it('should return error if not authenticated', function() {
      const company = fixtures.investorCompanyFactory();

      return API.logout()
      .then(() => API.createInvestorCompany(company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const company = fixtures.investorCompanyFactory();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.createInvestorCompany(company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const company = fixtures.investorCompanyFactory();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.createInvestorCompany(company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const company = fixtures.investorCompanyFactory();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.createInvestorCompany(company))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if rfc is not included', () => {
      const company = fixtures.investorCompanyFactory([ 'rfc' ]);

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('rfc');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if rfc is not unique', () => {
      const company = fixtures.investorCompanyFactory([ 'rfc' ]);

      company.rfc = fixtures.validRfc();

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('rfc');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if name is not included', () => {
      const company = fixtures.investorCompanyFactory([ 'name' ]);

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('name');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if business_name is not included', () => {
      const company = fixtures.investorCompanyFactory([ 'business_name' ]);

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('business_name');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if clabe is not included', () => {
      const company = fixtures.investorCompanyFactory([ 'clabe' ]);

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('clabe');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if clabe is not the correct format', () => {
      const company = fixtures.investorCompanyFactory();

      company.clabe = fixtures.invalidClabe();

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('clabe');
        errorData.error.code.should.be.eql(errorCodes.Investor[errorData.error.message]);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if clabe is not unique', () => {
      const company = fixtures.investorCompanyFactory();

      company.clabe = fixtures.notUniqueClabe();

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('clabe');
        errorData.error.code.should.be.eql(errorCodes.Investor[errorData.error.message]);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user name is not included', () => {
      const company = fixtures.investorCompanyFactory([ 'user.name' ]);

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {
        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('user.name');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user email is not included', () => {
      const company = fixtures.investorCompanyFactory([ 'user.email' ]);

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('user.email');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user email is not email format', () => {
      const company = fixtures.investorCompanyFactory();

      company.user.email = 'johndoe.com';

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('email');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user already is a member of a company', () => {
      const company = fixtures.investorCompanyFactory();
      const user = fixtures.existingUser();

      company.user.email = user.email;

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('email');
        errorData.error.data.company_name.should.be.equal('Fondeo Directo');
        errorData.error.code.should.be.eql(errorCodes.Investor[errorData.error.message]);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if fee is a negative value', () => {
      const company = fixtures.investorCompanyFactory([ 'operation_cost.fee' ]);

      company.operation_cost.fee = -1;

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('operation_cost.fee');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if fee is not included', () => {
      const company = fixtures.investorCompanyFactory([ 'operation_cost.fee' ]);

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('operation_cost.fee');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if taxpayer_type is not included', () => {
      const company = fixtures.investorCompanyFactory([ 'taxpayer_type' ]);

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('taxpayer_type');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if taxpayer_type is not a valid valud', () => {
      const company = fixtures.investorCompanyFactory([ 'taxpayer_type' ]);

      company.taxpayer_type = 'Not valid';

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('taxpayer_type');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a company object if there was no issue with the information', () => {
      const company = fixtures.investorCompanyFactory();

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Investor');
        return consumer.getNextEvent()
        .then(validate(invitationCreatedSchema))
        .then(validate(companySchema)(responseData.data));
      });
    });

    it('should return a company object if there was no issue with the information even though are decimals', () => {
      const company = fixtures.investorCompanyWithDecimal();

      return API.createInvestorCompany(company)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Investor');
        return consumer.getNextEvent()
        .then(validate(invitationCreatedSchema))
        .then(validate(companySchema)(responseData.data));
      });
    });
  });

  describe('addInvestorUser', () => {

    it('should return error if not authenticated', function() {
      const rfc = fixtures.validCompanyToAddInvestor();
      const user = fixtures.userUniqueFactory();

      return API.logout()
      .then(() => API.addInvestorUser(rfc, user))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const rfc = fixtures.validCompanyToAddInvestor();
      const user = fixtures.userUniqueFactory();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.addInvestorUser(rfc, user))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const rfc = fixtures.validCompanyToAddInvestor();
      const user = fixtures.userUniqueFactory();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.addInvestorUser(rfc, user))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const rfc = fixtures.validCompanyToAddInvestor();
      const user = fixtures.userUniqueFactory();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.addInvestorUser(rfc, user))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return an error if the company doesn\'t exists', () => {
      const rfc = fixtures.invalidRfc();
      const user = fixtures.userUniqueFactory();

      return API.addInvestorUser(rfc, user)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('company');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if name is not included', () => {
      const rfc = fixtures.validCompanyToAddInvestor();
      const user = fixtures.userUniqueFactory([ 'name' ]);

      return API.addInvestorUser(rfc, user)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('name');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if email is not included', () => {
      const rfc = fixtures.validCompanyToAddInvestor();
      const user = fixtures.userUniqueFactory([ 'email' ]);

      return API.addInvestorUser(rfc, user)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('email');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return an error if the user already is a member of a company', () => {
      const rfc = fixtures.validCompanyToAddInvestor();
      const user = fixtures.existingUser();

      return API.addInvestorUser(rfc, user)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.equal('Investor');
        errorData.error.path.should.be.equal('email');
        errorData.error.data.company_name.should.be.equal('Fondeo Directo');
        errorData.error.code.should.be.eql(errorCodes.Investor[errorData.error.message]);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a new investor structure', () => {
      const rfc = fixtures.validCompanyToAddInvestor();
      const user = fixtures.investorUniqueFactory();

      return API.addInvestorUser(rfc, user)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Investor');
        return consumer.getNextEvent()
        .then(validate(invitationCreatedSchema))
        .then(validate(newCompanyUserSchema)(responseData.data));
      });
    });
  });

  describe('getBalance', () => {

    it('should return error if not authenticated', function() {
      const rfc = fixtures.validRfc();

      return API.logout()
      .then(() => API.getCompanyBalance(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is cxc', function() {
      const rfc = fixtures.validRfc();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.getCompanyBalance(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is cxp', function() {
      const rfc = fixtures.validRfc();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.getCompanyBalance(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return not found error if company doesn\'t exist', () => {
      const rfc = fixtures.invalidRfc();

      return API.getCompanyBalance(rfc)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Balance');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return not found error if company doesn\'t belong to investor user', () => {
      const { rfc } = fixtures.validCompanyWithBalancePendingWithdraw();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getCompanyBalance(rfc))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Balance');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);

        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return balance minus pending withdraw transactions', () => {
      const { rfc, balance, transactions } = fixtures.validCompanyWithBalancePendingWithdraw();
      const expectedBalance = transactions.reduce((total, { amount }) => total - amount, balance);

      return API.getCompanyBalance(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Balance');
        responseData.data.total.should.be.eql(expectedBalance);

        return validate(balanceSchema)(responseData.data);
      });
    });

    it('should return total balance if company belongs investor user', () => {
      const { rfc, balance } = fixtures.validCompanyWithBalanceNoPendingWithdraw();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.getCompanyBalance(rfc))
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Balance');
        responseData.data.total.should.be.eql(balance);

        return validate(balanceSchema)(responseData.data);
      })
      .then(() => API.logout());
    });

    it('should return total balance as admin', () => {
      const { rfc, balance } = fixtures.validCompanyWithBalanceNoPendingWithdraw();

      return API.getCompanyBalance(rfc)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Balance');
        responseData.data.total.should.be.eql(balance);

        return validate(balanceSchema)(responseData.data);
      });
    });
  });

  describe('updateCompanyRoleSuspension', () => {

    it('should return error if not authenticated', function() {
      const { rfc } = fixtures.noSuspensionsCompany();
      const request = fixtures.suspendCXCRole();

      return API.logout()
      .then(() => API.updateCompanyRoleSuspension(rfc, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if cxc', function() {
      const { rfc } = fixtures.noSuspensionsCompany();
      const request = fixtures.suspendCXCRole();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.updateCompanyRoleSuspension(rfc, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if cxp', function() {
      const { rfc } = fixtures.noSuspensionsCompany();
      const request = fixtures.suspendCXCRole();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.updateCompanyRoleSuspension(rfc, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if investor', function() {
      const { rfc } = fixtures.noSuspensionsCompany();
      const request = fixtures.suspendCXCRole();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.updateCompanyRoleSuspension(rfc, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is invalid', function() {
      const rfc = fixtures.invalidRfc();
      const request = fixtures.invalidSuspendRole();

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role parameter is not provided', function() {
      const rfc = fixtures.invalidRfc();
      const request = fixtures.suspendCXCRole();

      delete request.role;

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if suspended parameter is not provided', function() {
      const rfc = fixtures.invalidRfc();
      const request = fixtures.suspendCXCRole();

      delete request.suspended;

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return not found if company doesn\'t exist', function() {
      const rfc = fixtures.invalidRfc();
      const request = fixtures.suspendCXCRole();

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.path.should.be.equal('Company');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if suspending suspended role', function() {
      const { rfc } = fixtures.suspendedCXCCompany();
      const request = fixtures.suspendCXCRole();

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if unsuspending unsuspended role', function() {
      const { rfc } = fixtures.noSuspensionsCompany();
      const request = fixtures.unsuspendCXCRole();

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should suspend cxc role', function() {
      const { rfc } = fixtures.noSuspensionsCompany();
      const request = fixtures.suspendCXCRole();

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Role');

        return consumer.getNextEvent()
        .then(validate(companyRoleSuspensionUpdated))
        .then(event => {
          event.value.body.role.should.be.eql('CXC');
          event.value.body.suspended.should.be.true;
        })
        .then(validate(successSchema)(responseData));
      });
    });

    it('should unsuspend cxc role', function() {
      const { rfc } = fixtures.noSuspensionsCompany();
      const request = fixtures.unsuspendCXCRole();

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Role');

        return consumer.getNextEvent()
        .then(validate(companyRoleSuspensionUpdated))
        .then(event => {
          event.value.body.role.should.be.eql('CXC');
          event.value.body.suspended.should.be.false;
        })
        .then(validate(successSchema)(responseData));
      });
    });

    it('should suspend cxp role', function() {
      const { rfc } = fixtures.noSuspensionsCompany();
      const request = fixtures.suspendCXPRole();

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Role');

        return consumer.getNextEvent()
        .then(validate(companyRoleSuspensionUpdated))
        .then(event => {
          event.value.body.role.should.be.eql('CXP');
          event.value.body.suspended.should.be.true;
        })
        .then(validate(successSchema)(responseData));
      });
    });

    it('should unsuspend cxp role', function() {
      const { rfc } = fixtures.noSuspensionsCompany();
      const request = fixtures.unsuspendCXPRole();

      return API.updateCompanyRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Role');

        return consumer.getNextEvent()
        .then(validate(companyRoleSuspensionUpdated))
        .then(event => {
          event.value.body.role.should.be.eql('CXP');
          event.value.body.suspended.should.be.false;
        })
        .then(validate(successSchema)(responseData));
      });
    });
  });

  describe('updateInvestorRoleSuspension', () => {

    it('should return error if not authenticated', function() {
      const { rfc } = fixtures.noSuspensionsInvestor();
      const request = fixtures.suspendInvestorRole();

      return API.logout()
      .then(() => API.updateInvestorRoleSuspension(rfc, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error unauthorized error if user is cxc', function() {
      const { rfc } = fixtures.noSuspensionsInvestor();
      const request = fixtures.suspendInvestorRole();

      return API.logout()
      .then(() => API.cxcLogin())
      .then(() => API.updateInvestorRoleSuspension(rfc, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error unauthorized error if user is cxp', function() {
      const { rfc } = fixtures.noSuspensionsInvestor();
      const request = fixtures.suspendInvestorRole();

      return API.logout()
      .then(() => API.cxpLogin())
      .then(() => API.updateInvestorRoleSuspension(rfc, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error unauthorized error if user is investor', function() {
      const { rfc } = fixtures.noSuspensionsInvestor();
      const request = fixtures.suspendInvestorRole();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.updateInvestorRoleSuspension(rfc, request))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role value is invalid', function() {
      const rfc = fixtures.invalidRfc();
      const request = fixtures.invalidSuspendRole();

      return API.updateInvestorRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role parameter is not provided', function() {
      const rfc = fixtures.invalidRfc();
      const request = fixtures.suspendInvestorRole();

      delete request.role;

      return API.updateInvestorRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if suspended parameter is not provided', function() {
      const rfc = fixtures.invalidRfc();
      const request = fixtures.suspendInvestorRole();

      delete request.suspended;

      return API.updateInvestorRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return not found if investor doesn\'t exist', function() {
      const rfc = fixtures.invalidRfc();
      const request = fixtures.suspendInvestorRole();

      return API.updateInvestorRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.path.should.be.equal('Investor');
        errorData.error.code.should.be.eql(errorCodes.Server.NotFound);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if suspending suspended role', function() {
      const { rfc } = fixtures.suspendedInvestor();
      const request = fixtures.suspendInvestorRole();

      return API.updateInvestorRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if unsuspending unsuspended role', function() {
      const { rfc } = fixtures.noSuspensionsInvestor();
      const request = fixtures.unsuspendInvestorRole();

      return API.updateInvestorRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Server.Unassigned);

        return validate(errorSchema)(errorData.error);
      });
    });

    it('should suspend investor', function() {
      const { rfc } = fixtures.noSuspensionsInvestor();
      const request = fixtures.suspendInvestorRole();

      return API.updateInvestorRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Role');

        return consumer.getNextEvent()
        .then(validate(investorRoleSuspensionUpdated))
        .then(event => {
          event.value.body.suspended.should.be.true;
        })
        .then(validate(successSchema)(responseData));
      });
    });

    it('should unsuspend investor role', function() {
      const { rfc } = fixtures.noSuspensionsInvestor();
      const request = fixtures.unsuspendInvestorRole();

      return API.updateInvestorRoleSuspension(rfc, request)
      .should.be.fulfilled
      .then(response => {

        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Role');

        return consumer.getNextEvent()
        .then(validate(investorRoleSuspensionUpdated))
        .then(event => {
          event.value.body.suspended.should.be.false;
        })
        .then(validate(successSchema)(responseData));
      });
    });
  });

  describe('propose', () => {

    beforeEach(() => API.cxcLogin());

    after(() => API.logout());

    it('should return error if not authenticated', function() {
      const data = fixtures.proposeCompany();

      return API.logout()
      .then(() => API.proposeCompany(data))
      .should.be.fulfilled
      .then(error => {
        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Session');
        errorData.error.code.should.be.eql(errorCodes.Session.Unauthorized);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if role is admin', function() {
      const data = fixtures.proposeCompany();

      return API.logout()
      .then(() => API.login())
      .then(() => API.proposeCompany(data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if role is investor', function() {
      const data = fixtures.proposeCompany();

      return API.logout()
      .then(() => API.investorLogin())
      .then(() => API.proposeCompany(data))
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Role');
        errorData.error.code.should.be.eql(errorCodes.Role.Unauthorized);
        return validate(errorSchema)(errorData.error);
      })
      .then(() => API.logout());
    });

    it('should return error if business_name is not present', function() {
      const data = fixtures.proposeCompany('business_name');

      return API.proposeCompany(data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Company');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if type is not present', function() {
      const data = fixtures.proposeCompany('type');

      return API.proposeCompany(data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Company');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if contact_name is not present', function() {
      const data = fixtures.proposeCompany('contact_name');

      return API.proposeCompany(data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Company');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if position is not present', function() {
      const data = fixtures.proposeCompany('position');

      return API.proposeCompany(data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Company');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if email is not present', function() {
      const data = fixtures.proposeCompany('email');

      return API.proposeCompany(data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Company');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return error if phone is not present', function() {
      const data = fixtures.proposeCompany('phone');

      return API.proposeCompany(data)
      .should.be.fulfilled
      .then(error => {

        const errorData = error.data;

        error.status.should.be.equal(200);
        errorData.type.should.be.eql('Company');
        errorData.error.code.should.be.eql(errorCodes.Server.InvalidRequest);
        return validate(errorSchema)(errorData.error);
      });
    });

    it('should return a successfully response', () => {
      const data = fixtures.proposeCompany();

      return API.proposeCompany(data)
      .should.be.fulfilled
      .then(response => {
        const responseData = response.data;

        response.status.should.be.equal(200);
        responseData.type.should.be.equal('Company');

        return consumer.getNextEvent()
        .then(validate(proposedCompany))
        .then(validate(successSchema)(responseData));
      });
    });
  });
});
