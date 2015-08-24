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
  ).add(
    new jsz.unit.TestCase({
      name: 'percent: type=d',
      setup: function() {
        this.assert = jsz.unit.assert;
      },
      methods: {
        flags: function() {
          this.assert.isEqual('<%%d>: <%d>'.format(3), '<%d>: <3>');
          this.assert.isEqual('<%%d>: <%d>'.format(-3), '<%d>: <-3>');
          this.assert.isEqual('<%% d>: <% d>'.format(3), '<% d>: < 3>');
          this.assert.isEqual('<%% d>: <% d>'.format(-3), '<% d>: <-3>');
          this.assert.isEqual('<%%0d>: <%0d>'.format(3), '<%0d>: <3>');
          this.assert.isEqual('<%%0d>: <%0d>'.format(-3), '<%0d>: <-3>');
          this.assert.isEqual('<%%#d>: <%#d>'.format(3), '<%#d>: <3>');
          this.assert.isEqual('<%%#d>: <%#d>'.format(-3), '<%#d>: <-3>');
          this.assert.isEqual('<%%+d>: <%+d>'.format(3), '<%+d>: <+3>');
          this.assert.isEqual('<%%+d>: <%+d>'.format(-3), '<%+d>: <-3>');
          this.assert.isEqual('<%%-d>: <%-d>'.format(3), '<%-d>: <3>');
          this.assert.isEqual('<%%-d>: <%-d>'.format(-3), '<%-d>: <-3>');
        },

        flagsWidth: function() {
          this.assert.isEqual('<%%6d>: <%6d>'.format(3), '<%6d>: <     3>');
          this.assert.isEqual('<%%6d>: <%6d>'.format(-3), '<%6d>: <    -3>');
          this.assert.isEqual('<%% 6d>: <% 6d>'.format(3), '<% 6d>: <     3>');
          this.assert.isEqual('<%% 6d>: <% 6d>'.format(-3), '<% 6d>: <    -3>');
          this.assert.isEqual('<%%06d>: <%06d>'.format(3), '<%06d>: <000003>');
          this.assert.isEqual('<%%06d>: <%06d>'.format(-3), '<%06d>: <-00003>');
          this.assert.isEqual('<%%#6d>: <%#6d>'.format(3), '<%#6d>: <     3>');
          this.assert.isEqual('<%%#6d>: <%#6d>'.format(-3), '<%#6d>: <    -3>');
          this.assert.isEqual('<%%+6d>: <%+6d>'.format(3), '<%+6d>: <    +3>');
          this.assert.isEqual('<%%+6d>: <%+6d>'.format(-3), '<%+6d>: <    -3>');
          this.assert.isEqual('<%%-6d>: <%-6d>'.format(3), '<%-6d>: <3     >');
          this.assert.isEqual('<%%-6d>: <%-6d>'.format(-3), '<%-6d>: <-3    >');
        },

        flagsWidthPrecision: function() {
          this.assert.isEqual('<%%9.2d>: <%9.2d>'.format(3),
            '<%9.2d>: <       03>');
          this.assert.isEqual('<%%9.2d>: <%9.2d>'.format(-3),
            '<%9.2d>: <      -03>');
          this.assert.isEqual('<%% 9.2d>: <% 9.2d>'.format(3),
            '<% 9.2d>: <       03>');
          this.assert.isEqual('<%% 9.2d>: <% 9.2d>'.format(-3),
            '<% 9.2d>: <      -03>');
          this.assert.isEqual('<%%09.2d>: <%09.2d>'.format(3),
            '<%09.2d>: <       03>');
          this.assert.isEqual('<%%09.2d>: <%09.2d>'.format(-3),
            '<%09.2d>: <      -03>');
          this.assert.isEqual('<%%#9.2d>: <%#9.2d>'.format(3),
            '<%#9.2d>: <       03>');
          this.assert.isEqual('<%%#9.2d>: <%#9.2d>'.format(-3),
            '<%#9.2d>: <      -03>');
          this.assert.isEqual('<%%+9.2d>: <%+9.2d>'.format(3),
            '<%+9.2d>: <      +03>');
          this.assert.isEqual('<%%+9.2d>: <%+9.2d>'.format(-3),
            '<%+9.2d>: <      -03>');
        }
      }

    })
  );

});
