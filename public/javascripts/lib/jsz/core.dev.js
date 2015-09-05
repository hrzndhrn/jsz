// DO NOT EDIT THIS FiLE! THIS FILE WILL BE GENERATED AN OVERWRITTEN.
// concat:
// lib/jsz/config.js
// lib/jsz/core/script.js
// lib/jsz/core/config.js
// lib/jsz/core.js


jsz = {
  script: {base:'/assets/javascripts'}
};

/**
 * script-loader
 */
(function() {
  'use strict';

  function isEqual(valueA) {
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
  }

  function isTrue(bool) {
    return bool === true;
  }

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

    script.map[conf.name] = conf;

    // TODO: simplify
    script._addDefaultRequirements(conf.name);
    script._defaultRequirement(conf.name);

    delete conf.name;

    if (conf.base !== undefined) {
      this._setBase(conf.base);
    }

    script._evalAll();

  };

  script.map = {};

  script.SLASH = '/';
  script.PERIOD = '.';
  script.PREFIX_JS = '.js';

  script._loadedScriptName = null;
  script._defaultRequirements = [];
  script._base = null;
  script._counter = 0;
  script._srcToNameRegExp = new RegExp('^http.*//[^/]*.(.*).js$');

  script._preloaded = [];



  /**
   * @todo refactoring
   */
  script.init = function (config) {
    if (config.base !== undefined) {
      this._setBase(config.base);
    }

    script._preloaded = (function() {
      var scriptElements = document.getElementsByTagName('script'),
        n = scriptElements.length, i = 0, preloaded = [];

      for (i; i < n; i++) {
        var src = scriptElements.item(i).src;
        if (src !== '') {
          var name = script._srcToNameRegExp.exec(src);
          if (name !== null) {
            preloaded.push(name[1]
              .replace( new RegExp(script.SLASH,'g'), script.PERIOD)
              .substr(script._base.length - 1)
            );
          }
        }
      }

      return preloaded;
    }());

    if (config.preloaded !== undefined) {
      script._preloaded = script._preloaded.concat(config.preloaded);
    }

    script._preloaded.forEach(function(preload) {
      if (script.map[preload] === undefined) {
        script.map[preload] = {
          default: false,
          loaded: true,
          evaluated: true,
          preloaded: true
        };
      }
    });
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

    var conf = {
      loaded: false,
      evaluated: false,
      preloaded: false
    };
    script.map[scriptName] = conf;
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
    var scriptObject = script.map[scriptName];

    if (scriptObject.default === undefined) {
      scriptObject.default = script._isDefault(scriptName);
    }
    else if (scriptObject.default === true) {
      script._defaultRequirements.push(scriptName);
    }
  };

  script._addDefaultRequirements = function (scriptName) {
    var scriptObject = script.map[scriptName];

    this._defaultRequirements.forEach(function (requirement) {
      var requirementObject = script.map[requirement];
      if (!requirementObject.require.some(isEqual(scriptName))) {
        scriptObject.require.push(requirement);
      }
    });
  };

  script._evalAll = function () {
    script._evalStack = [];
    Object.keys(script.map).forEach(script._eval);
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

      var scriptObject = script.map[scriptName];

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

(function() {
  'use strict';

  // A workaround for the safari browser.
  if (console !== undefined) {
    // console.clear();
  }

  // cehck config and set default
  var config;
  if (window.jsz === undefined) {
    config = {};
  }
  else {
    config = window.jsz;
    delete window.jsz;
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

  // ---------------------------------------------------------------------------
  // configuration

  // log
  if (config.log === undefined) {
    _jsz_.config.log = {};
  }
  else {
    _jsz_.config.log = config.log;
  }

  // script
  if (config.script === undefined) {
    _jsz_.config.script = {};
  }
  else {
    _jsz_.config.script = config.script;
    _jsz_.config.script.preloaded = [
      'lib.jsz.config',
      'lib.jsz.core.script',
      'lib.jsz.core.config'
    ];

    script.init(_jsz_.config.script);
  }

})();

/**     _
 *     (_) _________
 *     | |/ _____  /
 *    _| |\__ \ / /_
 *  / _   ____//____|
 * | (_) | Just Another
 *  \___/  JS Framework
 *
 */

(function() {
  'use strict';

  script({
    name: 'lib.jsz.core',
    default: true,
    require: [
      'lib.jsz.config',               // Configuration data.
      'lib.jsz.core.script',          // The script loader.
      'lib.jsz.core.config',          // Configuration for the script load and
                                      // jsz.
      'lib.jsz.core.main',            // some global constants and functions
      'lib.jsz.core.Array',           // Extensions for the built-in Array
      'lib.jsz.core.String',          // Extensions for the built-in String
      'lib.jsz.core.Date',            // Extensions for the built-in Date
      'lib.jsz.core.Function',        // Extensions for the built-in Function
      'lib.jsz.core.JSON',            // Extensions for the built-in JSON
      'lib.jsz.core.Namespace',       // Namespace for classes, modules, ...
      'lib.jsz.core.jsz',             // The jsz-namespace.
      'lib.jsz.core.Object',          // jsz.Object and ext. for the built-in.
      'lib.jsz.core.HTMLElement',     // A wrapper for the HTMLElements.
      'lib.jsz.core.HTMLElementsList',// A wrapper for a list ofr HTMLElements.
      'lib.jsz.core.dollar',          // Functions: $, $id, $$, ...
      'lib.jsz.core.dom',             // Functions to manipulate the DOM.
      'lib.jsz.core.Error',           // The jsz.Error class.
      'lib.jsz.core.Listener',        // Listener: A wrapper for all events.
      'lib.jsz.core.time'             // Some tools to works with dates and time
    ]
  });
})();