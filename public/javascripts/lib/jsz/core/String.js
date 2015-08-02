script({name: 'lib.jsz.core.String'}, function () {
  'use strict';

  String.prototype.toCamelCase = function () {
    var string = this;

    ['-', '_'].forEach(function (_char) {
      var splits = string.split(_char);
      if (splits.length > 1) {
        string = splits.shift().toLowerCase();
        splits.forEach(function (s) {
          string = string + s.substr(0, 1).toUpperCase() +
          s.substr(1).toLowerCase();
        });
      }
    });

    if (/^[A-Z,0-9]*$/.test(string)) {
      string = string.toLowerCase();
    }

    return string;
  };

  String.prototype.equalIgnoreCase = function (str) {
    var result = false;

    if (!(str === undefined || str === null)) {
      var regex = new RegExp('/^' + str + '$/', 'i');
      result = this.match(regex);
    }

    return result;
  };

  if (String.prototype.startsWith === undefined) {
    String.prototype.startsWith = function(searchString, position) {
      position = jsz.default(position, 0);
      return this.indexOf(searchString, position) === position;
    };
  }

});