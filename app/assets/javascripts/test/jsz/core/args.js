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

        this.fn = function() {
          // function(name, fn, scope)
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
  ).add(
    new jsz.unit.TestCase({
      name: 'args02',
      setup: function () {
        this.assert = jsz.unit.assert;

        this.fn = function() {
          // function(fn, scope, args, message)
          return jsz.args(arguments,
            {name: 'fn', type: Function},
            {name: 'scope', type: Object, optional: true, default: window},
            {name: 'args', type: Array, optional: true, default: []},
            {name: 'message', type: String, optional: true,
              default: JSZ.EMPTY_STRING}
          );
        };
      },
      methods: {

        oneArg: function () {
          var args = this.fn(noop);

          this.assert.isEqual(args.fn, noop);
          this.assert.isEqual(args.scope, window);
          this.assert.isEqualArray(args.args, []);
          this.assert.isEqual(args.message, JSZ.EMPTY_STRING);
        },

        twoArgs01: function() {
          var args = this.fn(noop, this);

          this.assert.isEqual(args.fn, noop);
          this.assert.isEqual(args.scope, this);
          this.assert.isEqualArray(args.args, []);
          this.assert.isEqual(args.message, JSZ.EMPTY_STRING);
        },

        twoArgs02: function() {
          var args = this.fn(noop, [1,2]);

          this.assert.isEqual(args.fn, noop);
          this.assert.isEqual(args.scope, window);
          this.assert.isEqualArray(args.args, [1,2]);
          this.assert.isEqual(args.message, JSZ.EMPTY_STRING);
        },

        twoArgs03: function() {
          var args = this.fn(noop, 'message');

          this.assert.isEqual(args.fn, noop);
          this.assert.isEqual(args.scope, window);
          this.assert.isEqualArray(args.args, []);
          this.assert.isEqual(args.message, 'message');
        }



      }
    })

  );

});
