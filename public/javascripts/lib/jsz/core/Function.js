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

        if ( !isFunction || isNoop) {
          // The _jsz_.properties will be defined on every new instance.
          this._jsz_.properties[key] =
            Object.createDescriptor(key, object[key]);
        }
        else {
          Object.addProperty( this.prototype, key, object[key]);
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
