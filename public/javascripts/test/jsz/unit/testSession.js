script({
  name: 'test.jsz.unit.testSession',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  log.debug('eval test.jsz.unit.testSession');

  jsz.unit.Session.add(
    new jsz.unit.TestCase({
      name: 'test.testCase',
      setup: function () {

        this.assert = jsz.unit.assert;
        this.aValue = 3;
      },
      methods: {

        isThree: function () {
          this.assert.equals(this.aValue, 3, 'is three');
        },

        isFour: function () {
          this.assert.equals(this.aValue, 4, 'is four');
        }

      }
    })
  );

  jsz.log.setType('stack');
  jsz.log.setLogTo($('div.log'));
  jsz.unit.Session.run().log();

});