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
          this.assert.isEqual(value, 1);
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

          this.assert.isEqual(keys.length, 2);

          this.assert.isEqual(keys[0], 'a');
          this.assert.isEqual(keys[1], 'b');

          this.assert.isEqual(result.a, 1);
          this.assert.isEqual(result.b, 2);
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

          this.assert.isEqual(keys.length, 3);

          this.assert.isEqual(keys[0], 'a');
          this.assert.isEqual(keys[1], 'b');
          this.assert.isEqual(keys[2], 'c');
          
          
          var resultA = result.a;
          var keysA = Object.keys(resultA).sort();

          this.assert.isEqual(keysA.length, 2);

          this.assert.isEqual(keysA[0], 'x');
          this.assert.isEqual(keysA[1], 'y');
          
          this.assert.isEqual(resultA.x, 1);
          this.assert.isEqual(resultA.y, 2);


          var resultB = result.b;
          var keysB = Object.keys(resultB).sort();

          this.assert.isEqual(keysB.length, 2);

          this.assert.isEqual(keysB[0], 'x');
          this.assert.isEqual(keysB[1], 'y');

          this.assert.isEqual(resultB.x, 1);
          this.assert.isEqual(resultB.y, 0);


          var resultC = result.c;
          var keysC = Object.keys(resultC).sort();

          this.assert.isEqual(keysC.length, 2);

          this.assert.isEqual(keysC[0], 'x');
          this.assert.isEqual(keysC[1], 'y');

          this.assert.isEqual(resultC.x, 0);
          this.assert.isEqual(resultC.y, 0);
        }

      }
    })
  );

});
