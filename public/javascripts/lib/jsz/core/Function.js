/**
 * This script adds some methods to the Function. This methods are used in the
 * class declaration of jsz.
 *
 * @author   Marcus Kruse
 * @version  0.1.0
 */
script({name: 'lib.jsz.core.Function'}, function () {
  'use strict';

  /**
   * The method def adds members and methods to a class.
   *
   * @param {Object} object
   * @returns {Function} Returns the class itself.
   */
  Function.prototype.def = function (object) {
    this._jsz_.properties = {};
    var key, enumerable, writeable, isFunction, isNoop;
    for (key in object) {
      if (object.hasOwnProperty(key)) {
        // Set new property to class.

        // The new property is a function.
        isFunction = object[key] !== null &&
          (typeof object[key] === 'function');

        isNoop = isFunction && object[key] === noop;

        // If key starts with '_' then set enumerable to false.
        enumerable = key.indexOf('_') !== 0;

        // If property a function and enumerable then writeable is false.
        // Overwrite protection for 'public' functions.
        writeable = !(enumerable && isFunction);

        // If key indicates a constant then set writeable to false.
        writeable = writeable && !(/^[A-Z][A-Z|_]*$/).test(key);


        if ( !isFunction || isNoop) {
          this._jsz_.properties[key] = {
            enumerable: enumerable,
            configurable: false,
            writable: writeable,
            value: object[key]
          };
        }
        else {
          Object.defineProperty(this.prototype, key, {
            enumerable: enumerable,
            configurable: false,
            writable: writeable,
            value: object[key]
          });
        }

      }
    }

    return this;
  };

  /**
   * The method static adds static members and methods to a class.
   *
   * @param {Object} object
   * @returns {Function} Returns the class itself.
   */
  Function.prototype.static = function (object) {
    var key;

    for (key in object) {
      if (object.hasOwnProperty(key)) {
        this[key] = object[key];
      }
    }

    return this;
  };

});
