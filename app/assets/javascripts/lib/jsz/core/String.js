/**
 * The script String.js contains some extensions to the built-in String.
 *
 * @author Marcus Kruse
 * @version 0.1.0
 */
script({name: 'lib.jsz.core.String'}, function () {
  'use strict';

  /**
   * The method String.toCamelCase returns this string in a camel case style.
   * @example
   * 'snake-case'.toCamelCase(); // returns 'snakeCase'
   * 'kebab_case'.toCamelCase(); // returns 'kebabCase'
   * 'kebab_snake-case'.toCamelCase(); // returns 'kebabSnakeCase'
   *
   * @returns {string}
   */
  String.prototype.toCamelCase = function () {
    var splits = this.split(/[-|_]/);
    var newString = splits.shift().toLowerCase();

    splits.forEach( function(string) {
      newString = newString + string.substr(0, 1).toUpperCase() +
        string.substr(1).toLowerCase();
    });

    return newString;
  };

  /**
   * Compares this string with the given string and ignoring the case.
   *
   * @param {String} str
   * @returns {boolean}
   */
  String.prototype.equalsIgnoreCase = function (str) {
    var result = false;

    if (!(str === undefined || str === null)) {
      var regex = new RegExp('^' + str + '$', 'i');
      result = regex.test(this);
    }

    return result;
  };

  if (String.prototype.startsWith === undefined) {
    /**
     * The startsWith method determines whether a string begins with the
     * characters of another string, returning true or false as appropriate.
     *
     * @param {String} searchString
     * @param {Integer} [position]
     * @returns {boolean}
     * ------------------------------------------------------------------------
     * @compatibility
     * @timestamp 2015-08-03
     * @reference {@link https://developer.mozilla.org/en-US/docs/Web/
     *   JavaScript/Reference/Global_Objects/String/startsWith#
     *   Browser_compatibility}
     * @ES 6
     * @FF 17
     * @CH 41, 36
     * @IE not supported
     * @OP not supported
     * @SF not supported
     */
    String.prototype.startsWith = function(searchString, position) {
      position = jsz.default(position, 0  );
      return this.indexOf(searchString, position) === position;
    };
  }

  if (String.repeat === undefined) {
    String.prototype.repeat = function(times) {
      var string = this.toString(),
        result = JSZ.EMPTY_STRING,
        i = 0;

      if (isNaN(times)) {
        throw new TypeError('Repeat times must be a number.');
      }

      if (times < 0) {
        throw new Error('Repeat times must non-negative!');
      }

      while (i < times) {
        result = result + string;
        i++;
      }

      return result;
    };
  }
});