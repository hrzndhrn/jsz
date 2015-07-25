script({
  name: 'lib.jsz.core.jsz',
  require: ['lib.jsz.core.Namespace']
}, function () {
  'use strict';

  module('jsz').def({

    ARGUMENTS_TO_STRING: '[object Arguments]',

    default: function(value, defaultValue) {
      return value === undefined ? defaultValue : value;
    },

    // All isType functions are just convenience functions. These functions
    // save a typeof and instanceof.

    isError: function (obj) {
      return obj instanceof Error;
    },

    isFunction: function (obj) {
      return typeof obj === 'function';
    },

    isRegExp: function (obj) {
      return obj instanceof RegExp;
    },

    isArguments: function (obj) {
      return obj !== undefined && (obj !== null) &&
        Object.prototype.toString.call(obj) === jsz.ARGUMENTS_TO_STRING;
    },

    /**
     * An alias for Array.isArray.
     * @param {*} obj
     * @static
     * @return {boolean}
     */
    isArray: Array.isArray,

    isObject: function (obj) {
      return obj && typeof obj === 'object' && !Array.isArray(obj);
    },

    isNumber: function (obj) {
      return typeof obj === 'number' && isFinite(obj);
    },

    isBoolean: function (obj) {
      return typeof obj === 'boolean';
    },

    isString: function (obj) {
      return typeof obj === 'string';
    },

    isInt: function (object) {
      var is = false;
      if (object !== undefined) {
        is = (/^-?\d+$/).test(object.toString());
      }
      return is;
    },

    isDate: function (obj) {
      return obj instanceof Date;
    }

  });

});