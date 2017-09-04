const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/User consumer', () => {

  afterEach(() => {
    sandbox.restore();
  });

});
