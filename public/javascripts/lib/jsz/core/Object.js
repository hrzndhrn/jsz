// TODO: Documentation
script({
  require: ['lib/jsz/core/Namespace.js']
}, function () {
  'use strict';

  jsz.Object = function () {
  };

  jsz.Object.prototype.getClass = function () {
    return _jsz_.classes[this.getClassName()];
  };

  jsz.Object.prototype.toString = function () {
    return '[Object ' + this.getClassName() + ']';
  };

  jsz.Object.prototype.getClassName = function () {
    return this._jsz_.namespace._jsz_.path + JSZ.DOT + this._jsz_.className;
  };

  jsz.Object.prototype.super = function (args) {
    var i = 0,
      n = this[_jsz_.META].super; // skip n constructors

    var extend = this[_jsz_.META].extend;
    for (i; i < n; i++) {
      // skip constructors
      extend = extend[_jsz_.META].extend;
    }
    _jsz_.super++;
    this[_jsz_.META].super++;

    if (!extend) {
      return;
    }


    var baseClass = extend;
    var baseClassName = baseClass[_jsz_.META].className;
    var baseConstructor = baseClass.prototype[baseClassName];

    // TODO: explain!
    var superArgs = arguments;
    if (jsz.isArguments(args)) {
      superArgs = args;
    }

    if (baseConstructor) {
      baseConstructor.apply(this, superArgs);
    }
    else {
      if (extend) {
        this.super.apply(this, superArgs);
      }
    }

    _jsz_.super--;
    this[_jsz_.META].super--;
  };

});