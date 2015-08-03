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
    this._jsz_.functions = [];
    var key;
    for (key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof object[key] === 'function') {
          this._jsz_.functions.push(key);
        }
        this.prototype[key] = object[key];
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
