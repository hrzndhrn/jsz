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

  window.READY_STATE = {
    LOADING: 'loading',
    INTERACTIVE: 'interactive',
    COMPLETE: 'complete'
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

  document.onreadystatechange = script._evalAll

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
        // The script object is available. Try to evaluate script.
        var evaluate = false;

        if (script._isReadyToEval(scriptObject)) {
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
      }

      script._evalStack.pop();
      evaluated = scriptObject.evaluated;
    }

    return evaluated;
  };

  /**
   * This function checks the script definition object for the onReadyState key.
   * If a onReadyState key available then the function return true if the
   * document.readyState equal or higher.
   *  # | onReadyState | document.readyState | return
   * ---+--------------+---------------------+--------
   *  1 | loading      | any                 | true
   *  2 | interactive  | loading             | false
   *  3 | complete     | loading             | false
   *  4 | interactive  | interactive         | true
   *  5 | complete     | interactive         | false
   *  6 | any          | complete            | true
   *
   * @param {Object} scriptObject
   * @private
   */
  script._isReadyToEval = function(scriptObject) {
    var docState = document.readyState,
      scriptState = scriptObject.onReadyState,
      isReadyToEval = false;

    if (scriptState === READY_STATE.LOADING || docState === READY_STATE.COMPLETE) {
      // cases: #1, #6
      isReadyToEval = true;
    }
    else if (scriptState === docState) {
      // case: #4
      isReadyToEval = true;
    }
    // else: isReadyToEval = false; cases: #2, #3, #5

    return isReadyToEval;
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
