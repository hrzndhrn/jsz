// TODO: Documentation
script({
  name: 'lib.jsz.core.Object',
  require: ['lib.jsz.core.Namespace']
  // require: []
}, function () {
  'use strict';

  jsz.Object = function () {
  };

  jsz.Object.prototype.getClass = function () {
    return _jsz_.classes[this.getClassName()];
  };

  jsz.Object.prototype.toString = function () {
    return '[object ' + this.getClassName() + ']';
  };

  jsz.Object.prototype.getClassName = function () {
    return this._jsz_.namespace._jsz_.path + JSZ.DOT + this._jsz_.className;
  };

  jsz.Object.prototype.super = function () {
    var i = 0,
      skip = this._jsz_.super; // skip n constructors

    var extend = this._jsz_.extend;
    for (i; i < skip; i++) {
      // skip constructors
      extend = extend._jsz_.extend;
    }


    if (extend !== undefined) {
      this._jsz_.super++;

      var baseClass = extend;
      var baseClassName = baseClass._jsz_.className;
      var baseConstructor = baseClass.prototype[baseClassName];

      if (baseConstructor) {
        baseConstructor.apply(this, arguments);
      }
      else {
        if (extend) {
          this.super.apply(this, arguments);
        }
      }

      this._jsz_.super--;
    }

  };

  // ===========================================================================
  // Static functions for the built-in Object.

  /**
   * Creates an identical object form the specified object.
   *
   * @note For teh moment its works just right fro plain objects.
   *
   * @param {*} object
   * @returns {*}
   */
  Object.clone = function(object) {
    if (object === undefined) {
      throw new Error('Can not clone undefined!');
    }
    return JSON.parse(JSON.stringify(object));
  };

});