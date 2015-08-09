script({
  name: 'test.jsz.core.args',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.core').add(
    new jsz.unit.TestCase({
      name: 'args01',
      setup: function () {
        this.assert = jsz.unit.assert;

        this.fn = function(name, fn, scope) {
          return jsz.args(arguments,
            {name: 'name', type: String, optional: true, default: 'bla'},
            {name: 'fn', type: Function},
            {name: 'scope', type: Object}
          );
        };
      },
      methods: {

        error: function () {
          var args, error;

          try {
            args = this.fn(noop);
          }
          catch(err) {
            error = err;
          }

          this.assert.isInstanceOf(error, Error);
          this.assert.isEqual(error.message, 'Missing argument scope!');
        },

        twoArgs: function() {
          var args = this.fn(noop, window);

          this.assert.isEqual(args.name, 'bla');
          this.assert.isEqual(args.fn, noop);
          this.assert.isEqual(args.scope, window);
        },

        threeArgs: function() {
          var args = this.fn('foo', noop, window);

          this.assert.isEqual(args.name, 'foo');
          this.assert.isEqual(args.fn, noop);
          this.assert.isEqual(args.scope, window);
        }



      }
    })
  );

});
