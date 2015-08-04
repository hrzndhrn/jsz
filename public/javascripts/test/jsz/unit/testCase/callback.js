script({
  name: 'test.jsz.unit.testCase.callback',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.unit').add(
    new jsz.unit.TestCase({
        name: 'TestCase:callbackSync',
        setup: function (testCase) {
          log.debug('setup sync');
          this.testCase = testCase;
          this.slave = testCase.callback('slave');
        },
        teardown: function() {
          log.debug('teardwon sync');
        },
        tests: [
          { name: 'master'},
          { name: 'slave'},
          { name: 'last'}
        ],
        methods: {
          master: function() {
            log.debug('master sync');
            this.slave();
          },

          slave: function() {
            log.debug('slave sync');
          },

          last: function() {
            log.debug('last sync');
          }
        }
      }
    )
  ).add(
    new jsz.unit.TestCase({
        name: 'TestCase:callbackAsync',
        setup: function (testCase) {
          log.debug('setup sync');
          this.assert = jsz.unit.assert;
          this.testCase = testCase;
          this.slave = testCase.callback('slave');
        },
        teardown: function() {
          log.debug('teardown async');
        },
        tests: [
          { name: 'master'},
          { name: 'slave'},
          { name: 'last'}
        ],
        methods: {
          master: function() {
            log.debug('master async');
            // Take a second to apply the callback.
            window.setTimeout( this.slave, 1000);
          },

          slave: function() {
            log.debug('slave async');
            this.assert.isFalse(this.testCase.isReady('last'));
          },

          last: function() {
            log.debug('last async');
          }
        }
      }
    )
  );


});
