const superagent = require('superagent-defaults')();
const userFixtures = require('../fixtures/user');
const sessionCredentials = userFixtures.validAdminUser();
const cxcSessionCredentials = userFixtures.validCxcUser();
const cxpSessionCredentials = userFixtures.validCxpUser();
const investorSessionCredentials = userFixtures.validInvestorUser();

class Api {
  constructor(host = 'http://localhost:3000', prefix = '/api/') {
    this.client = superagent.set('Content-type', 'application/json')
      .timeout({ response: 5000 });
    this.baseUrl = host + prefix;
    this.loggedIn = false;
  }

  request(method, url, data = {}, query = {}) {

    const client = this.client;
    const baseUrl = this.baseUrl;

    return new Promise(function(resolve, reject) {

      client[method](baseUrl + url).query(query).send(data)
      .end(function(err, result) {
        if (err) {
          return reject(err);
        }

        // Quickfix to follow prevoius agent structure
        const response = {
          status: result.status,
          data: result.body
        };

        return resolve(response);
      });
    });
  }

  requestWithFile(method, url, file, data = {}) {

    const client = this.client;
    const baseUrl = this.baseUrl;

    return new Promise(function(resolve, reject) {

      const request = client[method](baseUrl + url).attach('files', file);

      Object.keys(data).forEach(key => data[key] && request.field(key, data[key]));

      request
      .timeout({ response: 15000 })
      .end(function(err, result) {
        if (err) {
          return reject(err);
        }

        // Quickfix to follow prevoius agent structure
        const response = {
          status: result.status,
          data: result.body
        };

        return resolve(response);
      });
    });
  }

  setToken(token) {
    this.client.set('Authorization', `Bearer ${token}`);
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  login(req) {
    return this.request('post', 'v1/login', req || sessionCredentials)
    .then(response => {
      if (response.data.data) {
        this.setToken(response.data.data.token.token);
        this.loggedIn = true;
      }

      return response;
    });
  }

  cxcLogin() {
    return this.request('post', 'v1/login', cxcSessionCredentials)
    .then(response => {
      if (response.data.data) {
        this.setToken(response.data.data.token.token);
        this.loggedIn = true;
      }

      return response;
    });
  }

  cxpLogin() {
    return this.request('post', 'v1/login', cxpSessionCredentials)
    .then(response => {
      if (response.data.data) {
        this.setToken(response.data.data.token.token);
        this.loggedIn = true;
      }

      return response;
    });
  }

  investorLogin() {
    return this.request('post', 'v1/login', investorSessionCredentials)
    .then(response => {
      if (response.data.data) {
        this.setToken(response.data.data.token.token);
        this.loggedIn = true;
      }

      return response;
    });
  }

  logout() {
    return this.request('get', 'v1/logout').then(response => {
      this.loggedIn = false;

      return response;
    });
  }

  createCompany(company) {
    return this.request('post', 'v1/companies', company);
  }

  companyExists(rfc) {
    return this.request('get', 'v1/companies/' + rfc + '/exists');
  }

  updateCompany(rfc, company) {
    return this.request('put', 'v1/companies/' + rfc, company);
  }

  updateCompanyOperationCost(rfc, operationCost) {
    return this.request('put', `v1/companies/${rfc}/operation_cost`, operationCost);
  }

  updateInvestorOperationCost(rfc, operationCost) {
    return this.request('put', `v1/companies/investors/${rfc}/operation_cost`, operationCost);
  }

  getCompany(rfc) {
    return this.request('get', 'v1/companies/' + rfc);
  }

  getCompanies(page_size, page, order_by, order_desc) {
    return this.request('get', 'v1/companies', undefined, {
      page_size,
      page,
      order_by,
      order_desc
    });
  }

  getInvestorCompanies(page_size, page, order_by, order_desc) {
    return this.request('get', 'v1/companies/investors', undefined, {
      page_size,
      page,
      order_by,
      order_desc
    });
  }

  getBankInfo(clabe) {
    return this.request('get', 'v1/clabe/' + clabe );
  }

  getBankInfoByClabe(clabe) {
    return this.request('get', 'v1/clabe/' + clabe + '/exists');
  }

  getInvitation(token) {
    return this.request('get', 'v1/users/invitations/' + token);
  }

  registration(data, token) {
    return this.request('post', 'v1/users/invitations/' + token, data);
  }

  getUserRoles() {
    return this.request('get', 'v1/users/roles');
  }

  deleteUser(email) {
    return this.request('delete', 'v1/users/' + email);
  }

  getCompanyUsers(rfc, order_by, order_desc) {
    return this.request('get', 'v1/companies/' + rfc + '/users', undefined, {
      order_by,
      order_desc
    });
  }

  getOperationCost(rfc) {
    return this.request('get', `v1/companies/${rfc}/operation_cost`);
  }

  getInvestorOperationCost(rfc) {
    return this.request('get', `v1/companies/investors/${rfc}/operation_cost`);
  }

  resendInvitation(email) {
    return this.request('post', 'v1/users/invites/' + email + '/send');
  }

  addUser(rfc, data) {
    return this.request('post', 'v1/companies/' + rfc + '/users/invite', data);
  }

  addInvestorUser(rfc, data) {
    return this.request('post', 'v1/companies/investors/' + rfc + '/users/invite', data);
  }

  createInvestorCompany(company) {
    return this.request('post', 'v1/companies/investors', company);
  }

  changePassword(data) {
    return this.request('post', 'v1/users/change_password', data);
  }

  recoverPassword(data) {
    return this.request('post', 'v1/users/recover_password', data);
  }

  validateRecoverToken(token) {
    return this.request('get', 'v1/users/recover_password?token=' + token);
  }

  resetPassword(token, data) {
    return this.request('post', 'v1/users/reset_password/' + token, data);
  }

  uploadInvoice(file) {
    return this.requestWithFile('post', 'v1/invoices', file);
  }

  getInvoices(page_size, page, order_by, order_desc) {
    return this.request('get', 'v1/invoices', undefined, {
      page_size,
      page,
      order_by,
      order_desc
    });
  }

  getInvoice(id) {
    return this.request('get', 'v1/invoices/' + id);
  }

  approve(id, data) {
    return this.request('put', 'v1/invoices/' + id + '/approve', data);
  }

  reject(id, data) {
    return this.request('put', 'v1/invoices/' + id + '/reject', data);
  }

  publish(id) {
    return this.request('put', 'v1/invoices/' + id + '/publish');
  }

  fund(id) {
    return this.request('put', 'v1/invoices/' + id + '/fund');
  }

  invoiceCompleted(id, data) {
    return this.request('put', 'v1/invoices/' + id + '/completed', data);
  }

  lost(id, data) {
    return this.request('put', 'v1/invoices/' + id + '/lost', data);
  }

  latePayment(id, data) {
    return this.request('put', 'v1/invoices/' + id + '/late_payment', data);
  }

  rejectPublished(id, data) {
    return this.request('put', 'v1/invoices/' + id + '/reject_published', data);
  }

  rejectFunded(id, data) {
    return this.request('put', 'v1/invoices/' + id + '/reject_funded', data);
  }

  approveFund(id) {
    return this.request('put', 'v1/invoices/' + id + '/approve_fund');
  }

  getInvoiceEstimate(id) {
    return this.request('get', `v1/invoices/${id}/estimate`);
  }

  getInvoiceDetail(id) {
    return this.request('get', `v1/invoices/${id}/detail`);
  }

  getFundEstimate(id) {
    return this.request('get', `v1/invoices/${id}/fund_estimate`);
  }

  getInvoiceXml(id) {
    return this.request('get', `v1/invoices/${id}/xml`);
  }

  getMarketplace(query) {
    return this.request('get', 'v1/marketplace/invoices', undefined, query);
  }

  withdraw(data) {
    return this.request('post', 'v1/investor/withdraw', data);
  }

  getCompanyBalance(rfc) {
    return this.request('get', `v1/companies/${rfc}/balance`);
  }

  getInvestorFundEstimate(id) {
    return this.request('get', `v1/invoices/${id}/investor_fund_estimate`);
  }

  getPendingTransactions(rfc) {
    return this.request('get', `v1/companies/${rfc}/pending_transactions`);
  }

  getInvestorProfitEstimate(id) {
    return this.request('get', `v1/invoices/${id}/investor_profit_estimate`);
  }

  getInvestorFundDetail(id) {
    return this.request('get', `v1/invoices/${id}/investor_fund_detail`);
  }

  getInvoicePaymentSummary(id) {
    return this.request('get', `v1/invoices/${id}/payment_summary`);
  }

  getAdminInvoiceDetail(id) {
    return this.request('get', `v1/admin/invoices/${id}`);
  }

  deposit(data) {

    const url = 'v1/investor/deposit';
    const requestData = {
      amount: data.amount,
      deposit_date: data.deposit_date
    };
    const { file } = data;

    return this.requestWithFile('post', url, file, requestData);
  }

  approveTransaction(id) {
    return this.request('put', `v1/transactions/${id}/approve`);
  }

  rejectTransaction(id, data) {
    return this.request('put', `v1/transactions/${id}/reject`, data);
  }

  getInvestorInvoices(page_size, page, order_by, order_desc) {
    return this.request('get', 'v1/investor/invoices', undefined, {
      page_size,
      page,
      order_by,
      order_desc
    });
  }

  getAdminInvoices(query) {
    return this.request('get', 'v1/admin/invoices', undefined, query);
  }

  updateCompanyRoleSuspension(rfc, data) {
    return this.request('put', `v1/companies/${rfc}/role/suspension`, data);
  }

  updateInvestorRoleSuspension(rfc, data) {
    return this.request('put', `v1/companies/investors/${rfc}/role/suspension`, data);
  }

  createClientInvoicePayment(invoiceId, data) {

    const url = `v1/invoices/${invoiceId}/payment_request`;
    const requestData = {
      amount: data.amount,
      payment_date: data.payment_date
    };
    const { file } = data;

    return this.requestWithFile('post', url, file, requestData);
  }

  getClientInvoicePayment(id) {
    return this.request('get', `v1/invoices/${id}/payment_request`);
  }

  proposeCompany(data) {
    return this.request('put', 'v1/companies/propose', data);
  }
}

module.exports = new Api();
