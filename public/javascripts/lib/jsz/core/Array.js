/**
 * The script Array.js contains some extensions to the built-in Array.
 *
 * @author Marcus Kruse
 * @version 0.1.0
 */
script({name:'lib.jsz.core.Array'}, function () {
  'use strict';

  if (Array.from === undefined) {
    /**
     * The Array.from() method creates a new Array instance from an array-like
     * or iterable object.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/
     *   Reference/Global_Objects/Array/from|MDN: Array.from}
     *
     * @param {*} arrayLike An array-like or iterable object to convert to an
     *   array.
     * @param {Function} [mapCallback=noop] Map function to call on every
     *   element of the array.
     * @param {Object} [scope=window] Value to use as scope when executing
     *   mapCallback.
     * ------------------------------------------------------------------------
     * @compatibility
     * @timestamp 2015-07-31
     * @reference {@link https://developer.mozilla.org/en-US/docs/Web/
     *   JavaScript/Reference/Global_Objects/Array/from#Browser_compatibility|
     *   Array.from - Browser compatibility}
     * @ES 6
     * @FF 32
     * @CH 45, mobile not supported
     * @IE not supported
     * @OP not supported
     * @SF not supported
     */
    Array.from = function(arrayLike, mapCallback, scope) {
      if (arrayLike === undefined || arrayLike === null) {
        throw new TypeError('Array.from requires an array-like object' +
          ' - not null or undefined.');
      }

      var length = arrayLike.length;

      if (!(jsz.isInt(length) && length >= 0)) {
        throw new TypeError('Array.from requires an array-like object. ' +
          'Can not find length of array-like not found.');
      }

      // set a flag for the mapping
      var mapFlag = mapCallback !== undefined,
        newArray = new Array(length),
        index = 0,
        value;


      if (mapFlag) {
        scope = jsz.default(scope, window);
      }

      while(index < length) {
        if (mapFlag) {
          value = mapCallback.apply(scope, [arrayLike[index]]);
        }
        else {
          value = arrayLike[index];
        }

        newArray[index] = value;

        index++;
      }

      return newArray;
    };
  }

  if (Array.find === undefined) {
    /**
     * This method returns the first item of the array that match the specified
     * predicate.
     *
     * @param {Funtion} predicate
     * @param {Object} scope
     * @returns {*}
     * ------------------------------------------------------------------------
     * @compatibility
     * @timestamp 2015-08-04
     * @reference {@link https://developer.mozilla.org/en-US/docs/Web/
     *   JavaScript/Reference/Global_Objects/Array/find#Browser_compatibility|
     *   Array.find - Browser compatibility}
     * @ES 6
     * @FF 25
     * @CH not supported
     * @IE not supported
     * @OP not supported
     * @SF not supported
     */
    Array.prototype.find = function(predicate, scope) {
      var callback = unite(predicate, scope);

      var list = this,
        index = 0,
        length = list.length,
        item;

      while(index < length && item === undefined) {
        if (callback(list[index]) === true) {
          item = list[index];
        }
        index++;
      }

      return item;
    };
  }

    /**
   * Array.isEmpty returns true if an array contains no values.
   * @returns {boolean}
   */
  Array.prototype.isEmpty = function () {
    return this.length === 0;
  };

  /**
   * The contains method returns true if the given value is in the array. If the
   * method get a callback then they returns true if the callback function
   * returns true for any array element.
   * @param {*} value
   * @param {arrayContainsCallback} [callback]
   * @param {Object} [scope]
   * @returns {boolean}
   *
   * @callback arrayContainsCallback
   * @param {*} value The value that was passed to contains.
   * @param {*} currentValue The current element being processed in the array.
   * @param {*} index The index of the current element being processed in the
   *   array.
   * @param {Array} array The array contains was called upon.
   * @returns {boolean}
   */
  Array.prototype.contains = function (value, callback, scope) {
    // Value must be a type that can be handled by ===
    if (callback === undefined) {
      return this.some(isEquals(value));
    }
    else {
      return this.some(function(currentValue, index, array) {
        return apply(callback, scope, [value, currentValue, index, array]);
      });
    }

  };

});
