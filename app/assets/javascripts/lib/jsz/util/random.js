script({name: 'lib.jsz.util.random'}, function () {
  'use strict';

  namespace('jsz.util').module('random').def({

    int: function (min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return Math.floor(Math.random() * (max - min)) + min;
    },

    int_: function (min, max) {
      return function () {
        return jsz.random.int(min, max);
      };
    },

    bool: function () {
      return Boolean(this.int(2)).valueOf();
    },

    array: function (array) {
      return array[this.int(array.length)];
    },

    array_: function (array) {
      return function () {
        return jsz.random.array(array);
      };
    }

  });

});