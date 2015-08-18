script({
  name: 'test.jsz.util.format',
  require: [
    'lib.jsz.util.format',
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.util').add(
    new jsz.unit.TestCase({
      name: 'dollar: one placeholder',
      setup: function() {
        this.assert = jsz.unit.assert;
      },
      methods: {
        fromArgs: function() {
          this.assert.isEqual('value: $'.format(1), 'value: 1');
          this.assert.isEqual('value:$'.format(1), 'value:1');
          this.assert.isEqual('$-value'.format(1), '1-value');

          try {
            '$value'.format(1);
            throw new Error('Missing exception!');
          }
          catch(error) {
            this.assert.isEqual(error.message,
              'Input string was not in a correct format!');
          }
        }
      }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'dollar: escape',
      setup: function() {
        this.assert = jsz.unit.assert;
      },
      methods: {
        fromArgs: function() {
          this.assert.isEqual('value:$$ $'.format(1), 'value:$ 1');
          this.assert.isEqual('value$$:$'.format(1), 'value$:1');
          this.assert.isEqual('$-value$$'.format(1), '1-value$');
          this.assert.isEqual('$-value$$'.format(1), '1-value$');
          this.assert.isEqual('price: $$$'.format(1), 'price: $1');
        }
      }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'dollar: many placeholders',
      setup: function() {
        this.assert = jsz.unit.assert;
      },
      methods: {
        fromArgs: function() {
          this.assert.isEqual('$, $ and $'.format(1,2,3), '1, 2 and 3');
          this.assert.isEqual('$2, $ and $'.format(1,2,3), '2, 1 and 2');
        }
      }
    })
  );

});
