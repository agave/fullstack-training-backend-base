const chai = require('chai');
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const helper = require('../../../api/helpers/utils');
const fixtures = require('../fixtures/helpers/utils');

const fs = require('fs');

chai.should();
chai.use(require('chai-as-promised'));

describe('unit/Utils helper', () => {

  afterEach(() => {
    sandbox.restore();
  });

  describe('readFile', () => {

    const { path, error, response } = fixtures;

    beforeEach(() => {
      sandbox.stub(fs, 'readFile', (params, cb) => cb(null, response));
    });

    it('should return an error if there was an issue fetchin the file', () => {

      fs.readFile.restore();
      sandbox.stub(fs, 'readFile', (params, cb) => cb(error));

      return helper.readFile(path)
      .should.be.rejected
      .then(result => {

        fs.readFile.calledOnce.should.be.true;
        fs.readFile.calledWithMatch(path).should.be.true;
        result.should.be.eql(error);
      });
    });

    it('should return a file if there was no issue', () => {

      return helper.readFile(path)
      .should.be.fulfilled
      .then(result => {

        fs.readFile.calledOnce.should.be.true;
        fs.readFile.calledWithMatch(path).should.be.true;
        result.should.be.eql(response);
      });
    });
  });

  describe('unlink', () => {

    const { path, error, response } = fixtures;

    beforeEach(() => {
      sandbox.stub(fs, 'unlink', (params, cb) => cb(null, response));
    });

    it('should return an error if there was an issue fetchin the file', () => {

      fs.unlink.restore();
      sandbox.stub(fs, 'unlink', (params, cb) => cb(error));

      return helper.unlink(path)
      .should.be.rejected
      .then(result => {

        fs.unlink.calledOnce.should.be.true;
        fs.unlink.calledWithMatch(path).should.be.true;
        result.should.be.eql(error);
      });
    });

    it('should return a file if there was no issue', () => {

      return helper.unlink(path)
      .should.be.fulfilled
      .then(result => {

        fs.unlink.calledOnce.should.be.true;
        fs.unlink.calledWithMatch(path).should.be.true;
        result.should.be.eql(response);
      });
    });
  });

  describe('readDir', () => {

    const { path, error, response } = fixtures;

    beforeEach(() => {
      sandbox.stub(fs, 'readdir', (params, cb) => cb(null, response));
    });

    it('should return an error if there was an issue fetchin the file', () => {

      fs.readdir.restore();
      sandbox.stub(fs, 'readdir', (params, cb) => cb(error));

      return helper.readDir(path)
      .should.be.rejected
      .then(result => {

        fs.readdir.calledOnce.should.be.true;
        fs.readdir.calledWithMatch(path).should.be.true;
        result.should.be.eql(error);
      });
    });

    it('should return a file if there was no issue', () => {

      return helper.readDir(path)
      .should.be.fulfilled
      .then(result => {

        fs.readdir.calledOnce.should.be.true;
        fs.readdir.calledWithMatch(path).should.be.true;
        result.should.be.eql(response);
      });
    });
  });
});
