script({
  name: 'test.jsz.core.default',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.core').add(
    new jsz.unit.TestCase({
      name: 'default',
      setup: function () {
        this.assert = jsz.unit.assert;
      },
      methods: {

        setDefault: function() {
          var value;

          this.assert.isUndefined(value);

          value = jsz.default(value, 1);
          this.assert.equals(value, 1);
        },

        defaults01: function() {
          /**
           * @example
           * var hash = {a:1};
           * jsz.defaults(hash, {a:9,b:2}); // returns {a:1,b:2}
           * @link jsz.defaults:1
           */

          var hash = {a:1};
          var result = jsz.defaults(hash, {a:9,b:2});

          this.assert.isTrue(jsz.isPlainObject(result), 'result: ' + result);

          var keys = Object.keys(result).sort();

          this.assert.equals(keys.length, 2);

          this.assert.equals(keys[0], 'a');
          this.assert.equals(keys[1], 'b');

          this.assert.equals(result.a, 1);
          this.assert.equals(result.b, 2);
        },

        defaults02: function() {
          /**
           * @example
           * var hash = {a:{x:1,y:2},b:{x:1}};
           * jsz.defaults(hash, {a:{x:0,y:0}, b:{x:0, y:0}, c:{x:0, y:0}});
           * // returns {a:{x:1,y:2}, b:{x:1, y:0}, c:{x:0, y:0}}
           * @link jsz.defaults:2
           */

          var hash = {a:{x:1,y:2},b:{x:1}};
          var result = jsz.defaults(hash, 
            {a:{x:0,y:0}, b:{x:0, y:0}, c:{x:0, y:0}});
          var keys = Object.keys(result).sort();

          this.assert.equals(keys.length, 3);

          this.assert.equals(keys[0], 'a');
          this.assert.equals(keys[1], 'b');
          this.assert.equals(keys[2], 'c');
          
          
          var resultA = result.a;
          var keysA = Object.keys(resultA).sort();

          this.assert.equals(keysA.length, 2);

          this.assert.equals(keysA[0], 'x');
          this.assert.equals(keysA[1], 'y');
          
          this.assert.equals(resultA.x, 1);
          this.assert.equals(resultA.y, 2);


          var resultB = result.b;
          var keysB = Object.keys(resultB).sort();

          this.assert.equals(keysB.length, 2);

          this.assert.equals(keysB[0], 'x');
          this.assert.equals(keysB[1], 'y');

          this.assert.equals(resultB.x, 1);
          this.assert.equals(resultB.y, 0);


          var resultC = result.c;
          var keysC = Object.keys(resultC).sort();

          this.assert.equals(keysC.length, 2);

          this.assert.equals(keysC[0], 'x');
          this.assert.equals(keysC[1], 'y');

          this.assert.equals(resultC.x, 0);
          this.assert.equals(resultC.y, 0);
        }

      }
    })
  );

});
