/**
 * jsz init
 *
 */
script({
  name: 'lib.jsz.core.main'
}, function () {
  'use strict';

  // Workaround for the safari browser.
  if (console !== undefined) {
    console.clear();
  }

  /**
   * A namespace for jsz meta-data and configuration.
   */
  window._jsz_ = {
    classes: {},
    version: '0.0.1',
    uniqueId: 0,
    sealObjects: true,
    config: {}
  };

  // === jsz-Configuration =====================================================
  // If jsz defined then it holds some configurations for jsz. This var will be
  // overwritten later.
  if (window.jsz !== undefined) {
    if (jsz.log !== undefined) {
      _jsz_.config.log = jsz.log;
    }

    if (jsz.script !== undefined) {
      _jsz_.config.script = jsz.script;
    }

    delete window.jsz;
  }

  // set configuration defaults
  if (_jsz_.log === undefined) {
    _jsz_.log = {};
  }
  if (_jsz_.log.type === undefined) {
    _jsz_.log.type = 'console';
  }

  if (_jsz_.config.script !== undefined) {
    script.init(_jsz_.config.script);
  }


  // ===========================================================================
  // some global constants
  window.JSZ = {
    EMPTY_STRING: '',
    DOT: '.',
    BLANK: ' ',
    SLASH: '/',
    NEW_LINE: '\n',
    PREFIX: {
      JS: '.js'
    },
    META: '_jsz_'
  };

  // ===========================================================================
  // some global functions

  /**
   * The function uniqueId delivers site unique id.
   * @param {String} [prefix]
   * @returns {String}
   */
  window.uniqueId = function (prefix) {
    var id = ++_jsz_.uniqueId;
    return prefix === undefined ? 'ID:' + id : prefix + ':ID:' + id;
  };

  /**
   * This functions joins an scope with a function. In most cases this will be
   * an object and one of his methods.
   */
  window.unite = function (fun, scope) {
    var uniteFun;

    if (fun === undefined) {
      fun = noop;
    }

    if (fun.isUnited) {
      uniteFun = fun;
    }
    else {
      if (scope === undefined) {
        scope = window;
      }

      // The function which the original function and the scope unite.
      uniteFun = function () {
        // This will be executed when the unite is called.
        var args = arguments;
        if (arguments[0] && jsz.isArguments(arguments[0])) {
          args = arguments[0];
        }
        return fun.apply(scope, args);
      };

      uniteFun.isUnited = true;

      uniteFun = Object.freeze(uniteFun);
    }

    return uniteFun;
  };

  /**
   * A convenience function for Function.apply.
   * @param {Fucntion} fun
   * @param {Object} [scope]
   * @param {Array} [args]
   * @returns {*}
   */
  window.apply = function (fun, scope, args) {
    if ( arguments.length === 2)  {
      if (Array.isArray(scope)) {
        args = scope;
        scope = window;
      }
    }
    else {
      if (scope === undefined) {
        scope = window;
      }
    }

    return fun.apply(scope, args);
  };

  /**
   * No operation. This functions is used for do nothing.
   */
  window.noop = function () {
  };

  /**
   * A convenience function for Array.every and Array.some.
   * @param {boolean} bool
   * @returns {boolean}
   */
  window.isTrue = function (bool) {
    return bool === true;
  };

  /**
   * A convenience function for Array.every and Array.some.
   * @param {boolean} bool
   * @returns {boolean}
   */
  window.isFalse = function (bool) {
    return bool === false;
  };

  /**
   * A convenience function for Array.every and Array.some.
   * @param valueA
   * @returns {function}
   */
  window.isEqual = function (valueA) {
    var fun;
    if (typeof valueA.equal === 'function') {
      fun = function (valueB) {
        return valueA.equal(valueB);
      };
    }
    else {
      fun = function (valueB) {
        return valueA === valueB;
      };
    }

    return fun;
  };

  /**
   * A convenience function for Array.every and Array.some.
   * @param valueA
   * @returns {function}
   */
  window.isNotEqual = function (valueA) {
    var fun;
    if (typeof valueA.equal === 'function') {
      fun = function (valueB) {
        return !valueA.equal(valueB);
      };
    }
    else {
      fun = function (valueB) {
        return valueA !== valueB;
      };
    }

    return fun;
  };

  /**
   * A toString method for jsz classes.
   * @returns {string}
   */
  window._jsz_.classToString = function () {
    var path = this._jsz_.namespace._jsz_.path;
    var name = this._jsz_.className;
    return '[' + path + '.' + name + ' Class]';
  };
});
