script({
  name:'test.jsz.unit.testCase',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function() {
  'use strict';

  log.debug('eval test.jsz.unit.testCase');

  var tc = new jsz.unit.TestCase({
    name: 'test.testCase',
    setup: function() {

      log.debug('setup');
      this.assert = jsz.unit.assert;
      this.aValue = 3;
      log.debug('setup end');
    },
    methods: {
      aTest: function() {
        log.debug('A method in TestCase.');
      },

      isThree: function() {
        this.assert.equals(this.aValue, 3, 'is three');
      },

      isFour: function() {
        this.assert.equals(this.aValue, 4, 'is four');
      }

    }
  });

  log.debug('--- run ---');
  tc.run();
  log.dir(tc);
  log.debug('successful: ' + tc.isSuccessful());
  log.debug('--- ready ---');

});