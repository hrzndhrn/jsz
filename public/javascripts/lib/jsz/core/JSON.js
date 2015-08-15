/**
 * The script JSON.js contains some functions to build reviver.
 *
 * @author Marcus Kruse
 * @version 0.1.0
 */
script({name: 'lib.jsz.core.JSON'}, function () {
  'use strict';

  /**
   * A copy of the original parser.
   *
   * @param {String} jsonString
   * @param {Function} [reviver]
   * @return {Object}
   * @static
   */
  JSON._origignalParse = JSON.parse;

  /**
   * The function parse works like the built-in parse but takes the JSON.reviver
   * as reviver if it is set and the reviver is not set. The JSON.reviver is a
   * default for the reviver.
   *
   * @overwrite
   * @param {String} jsonString
   * @param {Function} [reviver]
   * @return {Object}
   * @static
   */
  JSON.parse = function(jsonString, reviver) {
    reviver = jsz.default(reviver, JSON.reviver);
    var object;
    if (reviver === undefined || reviver === null) {
      object = JSON._origignalParse(jsonString);
    }
    else {
      object = JSON._origignalParse(jsonString, reviver);
    }

    return object;
  };

  /**
   * The function reviverRegExpValue generates a reviver function for the parse
   * function. If the RegExp test evaluate to true for a value from the
   * jsonString this value will be send to format function.
   *
   * @param {RegExp} regExp
   * @param {Function} format
   * @returns {Function}
   */
  JSON.reviverRegExpValue = function (regExp, format) {
    return function (key, value) {
      return regExp.test(value) ? format(value) : value;
    };
  };

  /**
   * The function reviverZuluTime formats values of type yyyy-MM-ddTHH:mm:ssZ to
   * a date.
   * The used RegExp: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
   *
   * @type {Function}
   */
  JSON.reviverZuluTime = JSON.reviverRegExpValue(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, function (zulu) {
      return new Date(zulu);
    });

});