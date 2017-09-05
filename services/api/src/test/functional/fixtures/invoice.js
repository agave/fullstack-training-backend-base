const _ = require('lodash');
const factory = require('../factories/invoice');

const invoiceFixtures = require('/var/lib/core/integration_fixtures/invoice');
const pendingTransactionFixtures = require('/var/lib/core/integration_fixtures/pendingTransaction');

const today = new Date();

class InvoiceFixtures {
  validXml(version = '32') {
    return factory.validXml(version);
  }

  validXmlLongStamp(version = '32') {
    return factory.validXmlLongStamp(version);
  }

  invalidXml(version = '32') {
    return factory.invalidXml(version);
  }

  wrongCompany(version = '32') {
    return factory.wrongCompany(version);
  }

  wrongClient(version = '32') {
    return factory.wrongClient(version);
  }

  sameClientCompanyRfc(version = '32') {
    return factory.sameClientCompanyRfc(version);
  }

  notXml() {
    return factory.notXml();
  }

  validInvoiceId() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-UNIQUE' }).id;
  }

  validPublishInvoiceId() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-PUBLISH' }).id;
  }

  invalidDateToPublishInvoiceId() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-INVALIDDATETOPUBLISH' }).id;
  }

  invalidInvoiceId() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-INVALID' }).id;
  }

  validRejectInvoiceId() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-REJECT' }).id;
  }

  validFundEstimateInInvoiceId() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-INVOICEESTIMATE' }).id;
  }

  validFundEstimateInCompanyId() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-COMPANYESTIMATE' }).id;
  }

  validEstimateCompanyId() {
    return _.find(invoiceFixtures, { uuid: '97c63627-0965-4a11-8012-d8b65aa9a757' }).id;
  }

  invalidFundEstimateId() {
    return _.find(invoiceFixtures, { uuid: '97c63627-0965-5a21-8012-d8b65ba9a757' }).id;
  }

  expiredInvoice() {
    return _.find(invoiceFixtures, { uuid: 'aae9d77c-b824-4050-981b-736092bbccee' });
  }

  validFundRequestInvoiceId() {
    return _.find(invoiceFixtures, { uuid: 'b9a2ed62-e43e-4cdf-bd5e-c6cf2d6d9d78' }).id;
  }

  yesterdayFundRequestInvoice() {
    return _.find(invoiceFixtures, { uuid: '3be0321d-7c13-409e-b1f7-52a94f9a8c20' });
  }

  validFundRequestInvoiceTotal() {
    return _.find(invoiceFixtures, { uuid: 'b9a2ed62-e43e-4cdf-bd5e-c6cf2d6d9d78' }).total;
  }

  validTooExpensiveFundRequestInvoiceId() {
    return _.find(invoiceFixtures, { uuid: 'b9a2ed62-e43e-4cdf-bd6e-c6cc2e6d9d78' }).id;
  }

  validWithAnnualCostTooCheap() {
    return _.find(invoiceFixtures, { uuid: 'c9a2ed62-e43f-3cdf-bd6e-c6cc2e6d9d78' }).id;
  }

  validFundRequestedInvoice() {
    return _.find(invoiceFixtures, { uuid: 'b9a5ed62-e43e-4ccf-bd5e-d6cf2d6d9d78' }).id;
  }

  validMoralFundRequestedInvoice() {
    return _.find(invoiceFixtures, { uuid: 'b9a6ed22-e43e-4ccf-bd5e-d6cf2d6d9d78' }).id;
  }

  validInvoicePaymentSummary() {
    return _.find(invoiceFixtures, { uuid: '3be0322d-2a14-408e-b1f7-52a94f9a8c20' }).id;
  }

  validApprovedInvoice() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-COMPANYESTIMATE' }).id;
  }

  validInvoiceSummary() {
    const values = _.find(invoiceFixtures, { uuid: '3be0322d-2a14-408e-b1f7-52a94f9a8c20' });

    return {
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
        fund_date: values.fund_date.toString(),
        expiration: values.expiration.toString(),
        operation_term: 60,
        gain: 2500,
        gain_percentage: 2.5,
        annual_gain: 15
      }
    };
  }

  operationCost() {
    return factory.operationCost(100000, 3000, 97000);
  }

  invalidInvoiceCXP() {
    return _.find(invoiceFixtures, { uuid: '97c63627-0965-5a21-8012-d8b65ba9a753' });
  }

  validInvoiceCXP() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-UNIQUE' });
  }

  validMarketInvoiceId() {
    return _.find(invoiceFixtures, { uuid: '97c63625-0963-4a11-8012-d8b65aa9a757' }).id;
  }

  invalidMarketInvoiceId() {
    return _.find(invoiceFixtures, { uuid: '97c63625-0965-4a11-8012-d8b65aa9a757' }).id;
  }

  validFundedInvoiceId() {
    return _.find(invoiceFixtures, { uuid: '11j53625-9264-9h55-0742-d8b60eh3g0392' }).id;
  }

  validExpiredInvoiceId() {
    return _.find(invoiceFixtures, { uuid: 'k02s3625-9264-9h55-2832-d8b60eh0sr233' }).id;
  }

  fundedInvoices() {
    return _.filter(invoiceFixtures, { investor_rfc: 'AAZJ87184749069' });
  }

  unexcitingInvoiceId() {
    return 0;
  }


  validInvoiceIdForPendingTransaction() {
    return _.find(pendingTransactionFixtures, { id: 50006 }).data.invoice_id;
  }

  unexcitingPendingTransactionId() {
    return 999999;
  }

  unexcitingInvoiceIdForPendingTransaction() {
    return _.find(pendingTransactionFixtures, { id: 50007 }).data.invoice_id;
  }

  validNotRelatedToInvestorInvoiceId() {
    return _.find(pendingTransactionFixtures, { id: 50008 }).data.invoice_id;
  }

  validPendingTransactionFundToReject() {
    return _.find(pendingTransactionFixtures, { id: 50011 });
  }

  investorFundEstimate() {
    return factory.investorFundEstimate(100000, 3750, 250, 103500);
  }

  physicalInvestorFundEstimate() {
    return factory.physicalInvestorFundEstimate(100000, 3750, 375, 250, 103125);
  }

  investorProfitEstimate() {
    return factory.investorProfitEstimate(3750, 3.75, 15);
  }

  validPublishedIdToReject() {
    return _.find(invoiceFixtures, { uuid: 'd9a2ed62-e43f-3cdf-bd6e-c6cc2e6d9d78' }).id;
  }

  validPublishedIdToRejectForCxc() {
    return _.find(invoiceFixtures, { uuid: 'e9a2ed62-e43f-3cdf-bd6e-c6cc2e6d9d78' }).id;
  }

  validFundRequestedIdToReject() {
    return _.find(invoiceFixtures, { uuid: 'f9a2ed62-e43f-3cdf-bd6e-c6cc2e6d9d78' }).id;
  }

  validFundedInvoiceIdToPayWithJPGReceipt() {
    return _.find(invoiceFixtures, { uuid: '28h53625-0963-8s44-8012-d8b05fr9a757' }).id;
  }

  validFundedInvoiceIdToPayWithPNGReceipt() {
    return _.find(invoiceFixtures, { uuid: '93h53625-0963-9h55-8012-d8b60eh4a757' }).id;
  }

  validFundedInvoiceIdToPayWithPDFReceipt() {
    return _.find(invoiceFixtures, { uuid: '97k28425-0963-4a11-8012-d8b65ls8e757' }).id;
  }

  validFundedInvoiceIdToPayWithoutReceipt() {
    return _.find(invoiceFixtures, { uuid: '83j60371-1750-0a63-0166-d8b65ls8k825' }).id;
  }

  validPaymentInProcessInvoiceIdWithReceipt() {
    return _.find(invoiceFixtures, { uuid: '94f53625-9361-9h55-0825-d8b60eh4g926' }).id;
  }

  validPaymentInProcessInvoiceIdWithoutReceipt() {
    return _.find(invoiceFixtures, { uuid: '50d68425-1750-0a63-8012-d8b65ls8b820' }).id;
  }

  validAdminInvoiceDetailWithoutExpirationDate() {
    return _.find(invoiceFixtures, { uuid: '3be0322d-1b13-408e-b1f7-52a94f9a8c20' }).id;
  }

  validAdminInvoiceDetailWithoutInvestor() {
    return _.find(invoiceFixtures, { uuid: 'e9a2ed62-e43f-3cdf-bd6e-d6cc1a6d7d78' }).id;
  }

  validAdminInvoiceDetail() {
    return _.find(invoiceFixtures, { uuid: '3be0322d-2a14-408e-b1f7-52a94f9a8c20' }).id;
  }

  approvedInvoiceWithSuspendedCXP() {
    return _.find(invoiceFixtures, { uuid: '7A6A559B-CFC0-47D5-8B00-AB45A0D8DFF7-SUSPENDEDCXP' }).id;
  }

  validPaymentInProcessId() {
    return _.find(invoiceFixtures, { uuid: '02h63625-9264-9h55-0742-d8b60eh4s825' }).id;
  }

  validPaymentInProcessInvoice() {
    return _.find(invoiceFixtures, { uuid: '02h63625-9264-9h55-0742-d8b60eh4s825' });
  }

  validPaymentDueInvoice() {
    return _.find(invoiceFixtures, { uuid: '97b63675-1323-1c31-8012-b7b65ca9a757' }).id;
  }

  validPaymentDueToLatePaymentInvoice() {
    return _.find(invoiceFixtures, { uuid: '93b6a675-1323-1c31-8012-b7b65ca9a757' }).id;
  }

  validInvoiceCompletedRequest(remove) {
    const data = {
      cxp_payment: 100,
      cxp_payment_date: today,
      cxc_payment: 30,
      investor_payment: 50,
      fondeo_payment_date: today
    };

    return _.omit(data, remove);
  }

  validInvoiceLostData(remove) {
    const lostData = {
      cxc_payment: 30,
      investor_payment: 50,
      payment_date: today
    };

    const data = _.omit(lostData, remove);

    return data;
  }

  invalidInvoiceLostNegativeInvestorPayment() {
    return {
      cxc_payment: 30,
      investor_payment: -50,
      payment_date: today
    };
  }

  invalidInvoiceLostNegativeCxcPayment() {
    return {
      cxc_payment: -30,
      investor_payment: 50,
      payment_date: today
    };
  }

  invalidInvoiceLostDate() {
    return {
      cxc_payment: 30,
      investor_payment: 50,
      payment_date: 'today'
    };
  }

  validInvoiceLatePaymentData(remove) {
    const lostData = {
      cxc_payment: 30,
      investor_payment: 50,
      cxp_payment: 70,
      fondeo_payment_date: today,
      cxp_payment_date: today
    };

    const data = _.omit(lostData, remove);

    return data;
  }

  invalidInvoiceLatePaymentNegativeInvestorPayment() {
    return {
      cxc_payment: 30,
      investor_payment: -50,
      cxp_payment: 70,
      fondeo_payment_date: today,
      cxp_payment_date: today
    };
  }

  invalidInvoiceLatePaymentNegativeCxcPayment() {
    return {
      cxc_payment: -30,
      investor_payment: 50,
      cxp_payment: 70,
      fondeo_payment_date: today,
      cxp_payment_date: today
    };
  }

  invalidInvoiceLatePaymentNegativeCxpPayment() {
    return {
      cxc_payment: 30,
      investor_payment: 50,
      cxp_payment: -70,
      payment_date: today,
      cxp_payment_date: today
    };
  }

  invalidInvoiceLatePaymentDate() {
    return {
      cxc_payment: 30,
      investor_payment: 50,
      cxp_payment: 70,
      fondeo_payment_date: 'today',
      cxp_payment_date: today
    };
  }

  invalidInvoiceLatePaymentCxpDate() {
    return {
      cxc_payment: 30,
      investor_payment: 50,
      cxp_payment: 70,
      fondeo_payment_date: today,
      cxp_payment_date: 'today'
    };
  }

  validPageSizeLimit() {
    return {
      page_size: 2,
      page: 0
    };
  }

  invalidPageSizeLimit() {
    return {
      page_size: -1,
      page: 0,
      order_by: 'status'
    };
  }

  invalidPage() {
    return {
      page_size: 2,
      page: -1,
      order_by: 'status'
    };
  }

  invalidOrderBy() {
    return {
      page_size: 2,
      page: 0,
      order_by: 'email'
    };
  }

  invalidOrderDesc() {
    return {
      page_size: 2,
      page: 0,
      order_by: 'status',
      order_desc: 'something'
    };
  }

  validOrderBy() {
    return {
      page_size: 2,
      page: 0,
      order_by: 'client_name',
      order_desc: false
    };
  }

  validOrderDesc() {
    return {
      page_size: 2,
      page: 0,
      order_by: 'client_name',
      order_desc: true
    };
  }

  validClientName() {
    return {
      client_name: 'plex'
    };
  }

  validCompanyName() {
    return {
      company_name: 'CompanyUsers'
    };
  }

  validInvestorName() {
    return {
      investor_name: 'Zensure'
    };
  }

  validTotal() {
    return {
      min_total: 80,
      max_total: 100
    };
  }

  invalidMaxTotal() {
    return {
      min_total: 80,
      max_total: 'something'
    };
  }

  invalidMinTotal() {
    return {
      min_total: 'something',
      max_total: 100
    };
  }

  validDateRange() {
    const start_date = new Date();
    const end_date = new Date();

    start_date.setHours(0, 0, 0, 0);
    start_date.setDate(start_date.getDate());
    end_date.setHours(0, 0, 0, 0);
    end_date.setDate(end_date.getDate() + 89);

    return {
      start_date,
      end_date
    };
  }

  validExpirationDateRange() {
    const { start_date, end_date } = this.validDateRange();

    return {
      start_expiration_date: start_date,
      end_expiration_date: end_date
    };
  }

  validFundDateRange() {
    const { start_date, end_date } = this.validDateRange();

    return {
      start_fund_date: start_date,
      end_fund_date: end_date
    };
  }

  noOneMatchDateRange() {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);

    return {
      start_date: date,
      end_date: date
    };
  }

  invalidStartDate() {
    const end_date = new Date();

    end_date.setHours(0, 0, 0, 0);
    end_date.setDate(end_date.getDate() + 89);

    return {
      start_date: 'something',
      end_date
    };
  }

  invalidEndDate() {
    const start_date = new Date();

    start_date.setHours(0, 0, 0, 0);
    start_date.setDate(start_date.getDate() + 15);

    return {
      start_date,
      end_date: 'something'
    };
  }

  validOperationTerm() {
    const invoice = _.find(invoiceFixtures, { uuid: 'b9a6ed22-e43e-4ccf-bd5e-d6cf2d6d9d78' });
    const fundDay = invoice.fund_date;
    const expiration = invoice.expiration;
    const oneDay = 24 * 60 * 60 * 1000;

    fundDay.setHours(0, 0, 0, 0);
    expiration.setHours(0, 0, 0, 0);

    return Math.round(Math.abs((expiration.getTime() - fundDay.getTime()) / oneDay)) + 1;
  }

  invalidFundStartDate() {
    const { start_date, end_date } = this.invalidStartDate();

    return {
      start_fund_date: start_date,
      end_fund_date: end_date
    };
  }

  invalidFundEndDate() {
    const { start_date, end_date } = this.invalidEndDate();

    return {
      start_fund_date: start_date,
      end_fund_date: end_date
    };
  }

  invalidExpirationStartDate() {
    const { start_date, end_date } = this.invalidStartDate();

    return {
      start_expiration_date: start_date,
      end_expiration_date: end_date
    };
  }

  invalidExpirationEndDate() {
    const { start_date, end_date } = this.invalidEndDate();

    return {
      start_expiration_date: start_date,
      end_expiration_date: end_date
    };
  }

  validStatusArray() {
    return {
      status: [
        'approved',
        'published'
      ]
    };
  }

  invalidStatusArray() {
    return {
      status: [ 'invalid' ]
    };
  }

  totalInvoicesCount() {
    // Added padding to consider invoices created by tests
    return invoiceFixtures.length + 50;
  }
}

module.exports = new InvoiceFixtures();
