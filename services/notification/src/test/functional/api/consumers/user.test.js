const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const helper = require('../../helpers/consumers/user');

chai.should();
chai.use(chaiAsPromised);

describe('functional/User consumer', () => {

  before(() => helper.setup());

  after(() => helper.teardown());

  afterEach(() => sandbox.restore());

});
