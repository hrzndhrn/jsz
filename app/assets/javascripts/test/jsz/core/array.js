script({
  name: 'test.jsz.core.array',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.core').add(
    new jsz.unit.TestCase({
      name: 'Array',
      setup: function () {
        this.assert = jsz.unit.assert;

        this.fromArguments = function() {
          return Array.from(arguments);
        };

        this.value = 3;

        this.addValue = function(value) {
          return value + this.value;
        };

        this.fromArgumentsAddValue = function() {
          return Array.from(arguments, this.addValue, this);
        };

      },
      methods: {

        fromArguments: function () {
          this.assert.isEqualArray(this.fromArguments(1, 2, 3), [1, 2, 3]);
          this.assert.isEqualArray(
            this.fromArgumentsAddValue(1, 2, 3),
            [4, 5, 6]);
        },

        fromNodeList: function() {
          var ul = document.getElementsByTagName('ul')[0];
          var childNodes = ul.childNodes;
          this.assert.isEqualArray(
            Array.from(childNodes),
            [childNodes[0], childNodes[1], childNodes[2], childNodes[3]]
          );
        },

        fromString: function() {
          this.assert.isEqualArray(Array.from('abc'), ['a', 'b', 'c']);
          this.assert.isEqualArray(
            Array.from('abc', function(char) { return char.toUpperCase();}),
            ['A', 'B', 'C']);
        },

        isEmpty: function() {
          var array = [];
          this.assert.isTrue(array.isEmpty());
          array.push(1);
          this.assert.isFalse(array.isEmpty());
        },

        containsInt: function() {
          var array = [1,2,3];

          this.assert.isFalse(array.contains(0));
          this.assert.isTrue(array.contains(1));
          this.assert.isTrue(array.contains(2));
          this.assert.isTrue(array.contains(3));
          this.assert.isFalse(array.contains(4));
        },

        containsIntPredicate: function() {
          var array = [1,2,3];
          var predicate = function(string,number) {
            return parseInt(string,10) === number;
          };

          this.assert.isFalse(array.contains('0', predicate));
          this.assert.isTrue(array.contains('1', predicate));
          this.assert.isTrue(array.contains('2', predicate));
          this.assert.isTrue(array.contains('3', predicate));
          this.assert.isFalse(array.contains('4', predicate));
        }

      }
    })
  );

});
