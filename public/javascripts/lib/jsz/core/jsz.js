/**
 * The script jsz.js contains core functions.
 *
 * @author Marcus Kruse
 * @version 0.1.0
 */
script({
  name: 'lib.jsz.core.jsz',
  require: ['lib.jsz.core.Namespace']
}, function () {
  'use strict';

  module('jsz').def({

    ARGUMENTS_TO_STRING: '[object Arguments]',

    /**
     * The jsz.default function returns a default value if the value is
     * undefined.
     *
     * @param {*} value
     * @param {*} defaultValue
     * @returns {*}
     */
    default: function(value, defaultValue) {
      return value === undefined ? defaultValue : value;
    },

    /**
     * The jsz.defaults function returns a copy of object extended by missing
     * key value pairs from the default object. If the object is undefined then
     * the default object will be returned.
     *
     * @example
     * var hash = {a:1};
     * jsz.defaults(hash, {a:9,b:2}); // returns {a:1,b:2}
     *
     * @example
     * var hash = {a:{x:1,y:2},b:{x:1}};
     * jsz.defaults(hash, {a:{x:0,y:0}, b:{x:0, y:0}, c:{x:0, y:0}});
     * // returns {a:{x:1,y:2}, b:{x:1, y:0}, c:{x:0, y:0}}
     *
     * @param object
     * @param defaultObject
     * @returns {{}}
     */
    defaults: function(object, defaultObject) {
      // The original object will be cloned and the keys of the default objects
      // will be iterate to find missing key value pairs in the original object.
      var newObject = Object.clone(object);

      Object.keys(defaultObject).forEach(function(key) {
        if (object[key] === undefined) {
          // Take the value form the default object
          newObject[key] = defaultObject[key];
        }
        else {
          if (jsz.isPlainObject(defaultObject[key])) {
            // If the value of the default object is a plain object then go
            // deeper.
            newObject[key] = jsz.defaults(object[key], defaultObject[key]);
          }
          else {
            // Take the value from the original object.
            newObject[key] = object[key];
          }
        }
      });

      return newObject;
    },

    /**
     * @todo documentation
     * @experimental
     * @returns {Object}
     */
    args: function() {
      var argsDef = Array.from(arguments);
      var argsList = Array.from(argsDef.shift()),
        args = {};

      if (argsDef.length === argsList.length) {
        argsDef.forEach( function(argDef) {
          args[argDef.name] = argsList.shift();
        });
      }
      else {
        argsDef.forEach( function(argDef, index) {
          var name = argDef.name;
          args[name] = undefined;

          if ( argDef.type === String && jsz.isString(argsList[0])) {
            args[name] = argsList.shift();
          }
          else if (argsList[0] instanceof argDef.type) {
            args[name] = argsList.shift();
          }
          /* else if (argDef.type === Function && jsz.isFunction(argsList[0])) {
            args[name] = argsList.shift();
          }
          else if (argDef.type === Object && jsz.isObject(argsList[0])) {
            args[name] = argsList.shift();
          }*/
          else if (argDef.optional !== true) {
            throw new Error('Missing argument ' + name + '!');
          }

          if (argDef.default && args[name] === undefined) {
            args[name] = argDef.default;
          }

        });
      }

      return args;
    },

    // =========================================================================
    // All isType functions are just convenience functions. These functions
    // save a typeof or instanceof.

    /**
     * The jsz.isError function returns true if an object is an Error or an
     * jsz.Error object, false if it is not.
     *
     * @param {*} obj
     * @returns {boolean}
     */
    isError: function (obj) {
      return obj instanceof Error || obj instanceof jsz.Error;
    },

    /**
     * The jsz.isFunction function returns true if an object is a function,
     * false if it is not.
     *
     * @param {*} obj
     * @returns {boolean}
     */
    isFunction: function (obj) {
      return typeof obj === 'function';
    },

    /**
     * The jsz.isRegExp function returns true if an object is a regular
     * expression object,
     * false if it is not.
     *
     * @param {*} obj
     * @returns {boolean}
     */
    isRegExp: function (obj) {
      return obj instanceof RegExp;
    },

    /**
     * The jsz.isArguments function returns true if an object is an arguments
     * object, false if it is not.
     *
     * @param {*} obj
     * @returns {boolean}
     */
    isArguments: function (obj) {
      return obj !== undefined && (obj !== null) &&
        Object.prototype.toString.call(obj) === jsz.ARGUMENTS_TO_STRING;
    },

    /**
     * The jsz.isArray function returns true if an object is an array, false
     * if it is not.
     *
     * @param {*} obj
     * @return {boolean}
     */
    isArray: Array.isArray, // just an alias

    /**
     * The jsz.isObject function returns true if an object is an object,
     * false if it is not.
     *
     * @param {*} obj
     * @return {boolean}
     */
    isObject: function (obj) {
      return obj !== undefined && typeof obj === 'object' &&
        !Array.isArray(obj);
    },

    /**
     * The jsz.isObject function returns true if an object is a plain object,
     * false if it is not.
     *
     * @param {*} obj
     * @return {boolean}
     */
    isPlainObject: function(obj) {
      var is = jsz.isObject(obj);

      if (obj === window || jsz.isArguments(obj)) {
        is = false;
      }

      if ( is &&
        obj.constructor &&
        !obj.hasOwnProperty('constructor') &&
        !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
        is = false;
      }

      if (is) {
        var key;
        for ( key in obj) {
          /* empty */
        }

        is = (key === undefined || obj.hasOwnProperty(key));
      }

      return is;
    },

    /**
     * The jsz.isNumber function returns true if an object is a number,
     * false if it is not.
     *
     * @param {*} obj
     * @return {boolean}
     */
    isNumber: function (obj) {
      return typeof obj === 'number' && isFinite(obj);
    },

    /**
     * The jsz.isBoolean function returns true if an object is a boolean,
     * false if it is not.
     *
     * @param {*} obj
     * @return {boolean}
     */
    isBoolean: function (obj) {
      return typeof obj === 'boolean';
    },

    /**
     * The jsz.isBoolean function returns true if an object is a string,
     * false if it is not.
     *
     * @param {*} obj
     * @return {boolean}
     */
    isString: function (obj) {
      return typeof obj === 'string';
    },

    /**
     * The jsz.isBoolean function returns true if an object is an integer,
     * false if it is not.
     *
     * @param {*} object
     * @return {boolean}
     */
    isInt: function (object) {
      var is = false;
      if (object !== undefined) {
        is = (/^-?\d+$/).test(object.toString());
      }
      return is;
    },

    /**
     * The jsz.isBoolean function returns true if an object is a date,
     * false if it is not.
     *
     * @param {*} obj
     * @return {boolean}
     */
    isDate: function (obj) {
      return obj instanceof Date;
    }

  });

});