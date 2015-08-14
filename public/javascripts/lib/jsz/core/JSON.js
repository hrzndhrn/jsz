/**
 * The script JSON.js contains some functions to build reviver.
 *
 * @author Marcus Kruse
 * @version 0.1.0
 */
script({name: 'lib.jsz.core.JSON'}, function () {
  'use strict';

  JSON.reviverRegExp = function (regExp, fn) {
    return function (key, value) {
      return regExp.test(value) ? fn(value) : value;
    };
  };

  // Zulu-Format: yyyy-MM-dd'T'HH:mm:ss'Z'
  JSON.reviverZuluTime = JSON.reviverRegExp(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, function (zulu) {
      return new Date(zulu);
    });

  // The function JSON.reviver will be used by jsz.HttpRequest.
  // JSON.reviver = JSON.reviverZuluTime;

});