script({
  name: 'test.jsz.unit.testSession',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.add(
    new jsz.unit.TestCase({
      name: 'test.testCase',
      setup: function () {

        this.assert = jsz.unit.assert;
        this.aValue = 3;
      },
      tests: [
        {name: 'isThree'},
        {name: 'isFour'}
      ],
      methods: {

        isThree: function () {
          this.assert.isEqual(this.aValue, 3, 'is three');
        },

        isFour: function () {
          this.assert.isEqual(this.aValue, 4, 'is four');
        }

      }
    })
  );

  jsz.unit.Session.run().logTo($('div.log'));

});