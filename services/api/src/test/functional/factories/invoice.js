const path = require('path');

class InvoiceFactory {

  validXml(version) {
    return path.join(__dirname, `./valid${version}.xml`);
  }

  validXmlLongStamp(version) {
    return path.join(__dirname, `./valid${version}Long.xml`);
  }

  invalidXml(version) {
    return path.join(__dirname, `./invalid${version}.xml`);
  }

  wrongCompany(version) {
    return path.join(__dirname, `./wrongCompany${version}.xml`);
  }

  wrongClient(version) {
    return path.join(__dirname, `./wrongClient${version}.xml`);
  }

  sameClientCompanyRfc(version) {
    return path.join(__dirname, `./sameClientCompanyRfc${version}.xml`);
  }

  notXml() {
    return path.join(__dirname, './invoice.js');
  }

  operationCost(total, operationCost, fund_total) {
    return {
      total,
      operationCost,
      fund_total
    };
  }

  investorFundEstimate(total, earnings, commission, perception) {
    return {
      total,
      earnings,
      commission,
      perception
    };
  }

  physicalInvestorFundEstimate(total, earnings, isr, commission, perception) {
    return {
      total,
      earnings,
      isr,
      commission,
      perception
    };
  }

  investorProfitEstimate(gain, gain_percentage, annual_gain) {
    return {
      gain,
      gain_percentage,
      annual_gain
    };
  }
}

module.exports = new InvoiceFactory();
