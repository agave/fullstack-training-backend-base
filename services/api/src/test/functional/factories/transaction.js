const path = require('path');

class TransactionFactory {

  createWithdraw(amount = 0) {
    return {
      amount
    };
  }

  validJPG() {
    return path.join(__dirname, './example.jpg');
  }

  validPNG() {
    return path.join(__dirname, './example.png');
  }

  validPDF() {
    return path.join(__dirname, './example.pdf');
  }

  invalidFile() {
    return path.join(__dirname, './valid32.xml');
  }
}

module.exports = new TransactionFactory();
