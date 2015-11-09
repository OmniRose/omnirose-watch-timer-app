exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://127.0.0.1:8100',
  specs: ['end-to-end/*.js']
};
