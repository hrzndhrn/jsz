script({
  name: 'test.jsz.core.bind',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.core').add(
    new jsz.unit.TestCase({
      name: 'bind',
      setup: function () {
        this.assert = jsz.unit.assert;

        this.obj = {
          x: 0
        };

        this._getX = function() {
          return this.x;
        };

        this._incX = function() {
          this.x++;
        };

        this._getThis = function() {
          return this;
        };
      },
      tests: [
        {name: 'create'},
        {name: 'call'}
      ],
      methods: {

        create: function() {
          this.getX = bind(this._getX, this.obj);
          this.assert.isTrue(jsz.isFunction(this.getX));

          this.incX = bind(this._incX, this.obj);
          this.assert.isTrue(jsz.isFunction(this.incX));

          this.getThis = bind(this._getThis);
          this.assert.isTrue(jsz.isFunction(this.getThis));
        },

        call: function() {
          this.assert.isEqual(this.getX(), 0);
          this.incX();
          this.assert.isEqual(this.getX(), 1);

          this.assert.isEqual(this.getThis(), window);
        }

      }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'bind',
      setup: function () {
        this.assert = jsz.unit.assert;

        this._getArgs = function(a,b) {
          return {
            a:a, b:b
          };
        };
      },
      tests: [
        {name: 'create'}
      ],
      methods: {

        create: function() {
          this.getArgs1 = bind(this._getArgs);
          this.assert.isTrue(jsz.isFunction(this.getArgs1));

          this.getArgs2 = bind(this._getArgs, this);
          this.assert.isTrue(jsz.isFunction(this.getArgs2));
        },

        call01: function() {
          var args1 = this.getArgs1(1,2);
          this.assert.isEqual(args1.a, 1);
          this.assert.isEqual(args1.b, 2);

          var args2 = this.getArgs2(1,2);
          this.assert.isEqual(args2.a, 1);
          this.assert.isEqual(args2.b, 2);
        },

        call02: function() {
          var args1 = this.getArgs1([1,2],2);
          this.assert.isEqual(args1.a[0], 1);
          this.assert.isEqual(args1.a[1], 2);
          this.assert.isEqual(args1.b, 2);

          var args2 = this.getArgs2([1,2],2);
          this.assert.isEqual(args2.a[0], 1);
          this.assert.isEqual(args2.a[1], 2);
          this.assert.isEqual(args2.b, 2);
        },

        call03: function() {
          var args1 = this.getArgs1([1,2]);
          this.assert.isEqual(args1.a[0], 1);
          this.assert.isEqual(args1.a[1], 2);
          this.assert.isEqual(args1.b, undefined);

          var args2 = this.getArgs2([1,2]);
          this.assert.isEqual(args2.a[0], 1);
          this.assert.isEqual(args2.a[1], 2);
          this.assert.isEqual(args2.b, undefined);
        }

      }
    })
  );

});
