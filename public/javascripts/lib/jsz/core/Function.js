script({name: 'lib.jsz.core.Function'}, function () {
  'use strict';

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
