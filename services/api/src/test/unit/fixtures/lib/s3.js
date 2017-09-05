const key = 'test/file.png';
const body = 'file body';
const error = {
  message: 'Access Denied'
};
const guid = 'a62ca90f-854e-4227-aa28-81487d94c4f4';

module.exports = {
  upload: {
    logErrorParams: [
      'File upload failed',
      guid,
      error
    ],
    logMessageParams: [
      'File uploaded successfully',
      key,
      'S3',
      guid
    ],
    key,
    body,
    putObjectParams: {
      Key: key,
      Body: body
    },
    error,
    guid
  },
  getUrl: {
    signedParams: {
      first: 'getObject',
      second: { Key: key }
    },
    logErrorParams: [
      'Get file url',
      guid,
      error
    ],
    logMessageParams: [
      'Get file url',
      key,
      'S3',
      guid
    ],
    baseUrl: 'base/path/to/',
    errorMessage: 'Url not found',
    key,
    error,
    guid
  }
};
