// merged script
// /lib/jsz/core/script.js
// /lib/jsz/core/init.js
// /lib/jsz/core.js

/**
 * script-loader
 */
(function() {
  'use strict';

  /**
   * Adds a new script tag to the head of the site.
   */
  window.script = function (conf, fun) {
    conf.fun = fun === undefined ? function(){} : fun;
    conf.evaluated = false;
    conf.loaded = true;

    if (conf.require === undefined) {
      conf.require = [];
    }

    if (conf.name === undefined) {
      conf.name = uniqueId('SCRIPT');
    }

    script.list[conf.name] = conf;

    // TODO: simplify
    script._addDefaultRequirements(conf.name);
    script._defaultRequirement(conf.name);

    delete conf.name;

    if (conf.base !== undefined) {
      this._setBase(conf.base);
    }

    script._evalAll();

  };

  script.list = {};

  script.SLASH = '/';
  script.PREFIX_JS = '.js';

  script._loadedScriptName = null;
  script._defaultRequirements = [];
  script._base = null;
  script._counter = 0;

  script._preloaded = (function() {
    var scriptElements = document.getElementsByTagName('script'),
      n = scriptElements.length, i = 0, preloaded = [];

    for (i; i < n; i++) {
      var src = scriptElements.item(i).src;
      if (src !== '') {
        preloaded.push(src);
      }
    }

    return preloaded;
  }());

  /**
   * @todo refactoring
   */
  script.init = function (config) {
    if (config.base !== undefined) {
      this._setBase(config.base);
    }
  };

  script._setBase = function(base) {
    script._base = script.SLASH +
      (/\/*(.*[^\/])\/*/).exec(base)[1] + script.SLASH;
  };

  script.load = function (scriptName) {
    if (script._base === null) {
      throw new Error('Script-loader not initialized! base = null');
    }

    var scriptTag = document.createElement('script');

    scriptTag.setAttribute('src', script._src(scriptName));
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('async', 'true');

    document.head.appendChild(scriptTag);

    var conf = {loaded: false, evaluated: false};
    script.list[scriptName] = conf;
    return conf;
  };

  script._src = function (scriptName) {
    if (/^[\w\.]*$/.test(scriptName)) {
      return script._base +
        scriptName.replace(/\./g, script.SLASH) +
        script.PREFIX_JS;
    }
    else {
      throw new Error('Wrong format! script-name = ' + scriptName);
    }
  };

  script._defaultRequirement = function (scriptName) {
    var scriptObject = script.list[scriptName];

    if (scriptObject.default === undefined) {
      scriptObject.default = script._isDefault(scriptName);
    }
    else if (scriptObject.default === true) {
      script._defaultRequirements.push(scriptName);
    }
  };

  script._addDefaultRequirements = function (scriptName) {
    var scriptObject = script.list[scriptName];

    this._defaultRequirements.forEach(function (requirement) {
      var requirementObject = script.list[requirement];
      if (!requirementObject.require.some(isEqual(scriptName))) {
        scriptObject.require.push(requirement);
      }
    });
  };

  script._evalAll = function () {
    script._evalStack = [];
    Object.keys(script.list).forEach(script._eval);
  };

  script._eval = function (scriptName) {
    var evaluated = false;

    // start with the evaluation when script._base is set
    if (script._base !== null) {
      if (script._evalStack.some(isEqual(scriptName))) {
        throw new Error('Cycle reference in script-loader! ' +
          script._evalStack.join(' > ') + ' > ' + scriptName);
      }
      else {
        script._evalStack.push(scriptName);
      }

      var scriptObject = script.list[scriptName];

      if (scriptObject === undefined) {
        // The script has to be loaded
        scriptObject = script.load(scriptName);
      }
      else if (scriptObject.loaded && !scriptObject.evaluated) {
        var evaluate = false;
        if (scriptObject.require === undefined) {
          evaluate = true;
        }
        else {
          evaluate = scriptObject.require.map(script._eval).every(isTrue);
        }

        if (evaluate) {
          if (scriptObject.fun !== undefined) {
            scriptObject.fun.apply(window);
          }
          scriptObject.evaluated = true;
          delete scriptObject.fun;
        }
      }

      script._evalStack.pop();
      evaluated = scriptObject.evaluated;
    }

    return evaluated;
  };

  script._isDefault = function (scriptName) {
    var isDefault = false,
      defaultRequirement,
      n = script._defaultRequirements.length,
      i = 0;

    for (i; i < n; i++) {
      defaultRequirement = script._defaultRequirements[i];
      if (scriptName === defaultRequirement) {
        isDefault = true;
        break;
      }
    }

    return isDefault;
  };

})();

/**
 * jsz init
 *
 */
(function () {
  'use strict';

  if (console !== undefined) {
    // console.clear();
  }

  /** A namespace for jsz meta-data and configuration.
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

  window.apply = function (fun, scope, args) {
    if (scope === undefined) {
      scope = window;
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
   *
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
   *
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
})();

/**     _
 *     (_)________
 *     | / ____  /
 *    _| \__ \/ /
 *  / _   ___/___|
 * | (_) | Just Another
 *  \___/  JavaScript Framework
 *
 */
(function() {
  'use strict';

  script({
    name: 'lib.jsz.core',
    default: true,
    require: [
      // 'lib.jsz.core.script',
      // 'lib.jsz.core.init',
      'lib.jsz.core.Array',
      'lib.jsz.core.String',
      'lib.jsz.core.Date',
      'lib.jsz.core.Function',
      'lib.jsz.core.Namespace',
      'lib.jsz.core.jsz',
      'lib.jsz.core.Object',
      'lib.jsz.core.HTMLElement',
      'lib.jsz.core.HTMLElementsList',
      'lib.jsz.core.dollar',
      'lib.jsz.core.dom',
      'lib.jsz.core.Error',
      'lib.jsz.core.JSON',
      'lib.jsz.core.Listener',
      'lib.jsz.core.time'
    ]
  });
})();
