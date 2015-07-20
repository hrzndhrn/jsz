/** jsz
 * Just another JavScriptFramework
 * Version: 0.1.0
 */

/** A namespace for sim meta-data to jsz.
 */
var _jsz_ = {
  classes: {}
};

// Some Constants
var JSZ = {
  EMPTY_STRING: '',
  DOT: '.',
  BLANK: ' ',
  SLASH: '/',
  PREFIX: {
    JS: '.js'
  }
};

/**
 * This functions joins an scope with a function. In most cases this will be an
 * object and one of his methods.
 */
function unite(fun, scope) {
  if (fun === undefined) {
    fun = noop;
  }

  if (fun.isUnited) {
    throw new Error("Can not unite an united function!");
  }

  if (scope === undefined) {
    scope = window;
  }

  var uniteFun = function () {
    return fun.apply(scope, arguments);
  }

  uniteFun.isUnited = true;

  return Object.freeze(uniteFun);
}

function apply(fun, scope, args) {
  if (scope === undefined) {
    scope = window;
  }
  return fun.apply(scope, args);
}

function noop() {
};

function isTrue(value) {
  return value === true
};

function isFalse(value) {
  return value === false
};

function isEqual(valueA) {
  var fun;
  if (typeof valueA['equal'] === 'function') {
    fun = function (valueB) {
      return valueA.equal(valueB);
    }
  }
  else {
    fun = function (valueB) {
      return valueA === valueB;
    }
  }

  return fun;
}

function isNotEqual(valueA) {
  var fun;
  if (typeof valueA['equal'] === 'function') {
    fun = function (valueB) {
      return !valueA.equal(valueB);
    }
  }
  else {
    fun = function (valueB) {
      return valueA !== valueB;
    }
  }

  return fun;
}

/** ----------------------------------------------------------------------------
 *  @section script-loader
 */

/** Adds a new script tag to the head of the site.
 */
script = function (conf, fun) {
  conf.fun = fun;
  conf.evaluated = false;
  conf.loaded = true;

  if (conf.require === undefined) {
    conf.require = [];
  }

  if (conf.name === undefined) {
    throw new Error('Script without name!');
  }
  else {
    script.list[conf.name] = conf;

    // TODO: simplify
    script._addDefaultRequirements(conf.name);
    script._defaultRequirement(conf.name);

    delete conf.name;

    script._evalAll();
  }

};

script.list = {};

script._loadedScriptName = null;
script._defaultRequirements = [];
script._base = null;
script._counter = 0;

script.init = function (conf, fun) {
  if (conf.defaultRequirements !== undefined) {
    script._defaultRequirements =
      script._defaultRequirements.concat(conf.defaultRequirements);
    delete conf.defaultRequirements;
  }

  if (conf.name !== undefined) {
    if (fun === undefined) {
      fun = function () {
      };
    }

    script(conf, fun);
  }

  if (conf.base !== undefined) {
    script._base = JSZ.SLASH +
    (/\/*(.*[^\/])\/*/).exec(conf.base)[1] +
    JSZ.SLASH;

    script._evalAll();
  }
};

script.load = function (scriptName) {
  if (script._base === null) {
    throw new Error('Script-loader not initialized! base = null');
  }

  var scriptTag = document.createElement('script');

  scriptTag.setAttribute("src", script._src(scriptName));
  scriptTag.setAttribute("type", "text/javascript");

  document.head.appendChild(scriptTag);

  var conf = {loaded: false, evaluated: false};
  script.list[scriptName] = conf;
  return conf;
};

script._src = function (scriptName) {
  if ( /^[\w\.]*$/.test(scriptName)) {
    return script._base +
      scriptName.replace(/\./g, JSZ.SLASH) +
      JSZ.PREFIX.JS;
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
  })
};

script._evalAll = function () {
  script._evalStack = [];
  Object.keys(script.list).forEach(script._eval);
};

script._eval = function (scriptName) {
  var evaluated = false;

  // start with the evaluation when script._base is set
  if (script._base !== null) {
    if ( script._evalStack.some(isEqual(scriptName))) {
      throw new Error("Cycle reference in script-loader! " +
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
        scriptObject.fun.apply(window);
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
}

/* In core-dev.js the other core scripts will be loaded here.
 The original core.js will have the code inserted.
 */

script.init({
  name: "lib.jsz.core",
  default: true,
  require: [
    "lib.jsz.core.Array",
    "lib.jsz.core.String",
    "lib.jsz.core.Function",
    "lib.jsz.core.Namespace",
    "lib.jsz.core.type",
    "lib.jsz.core.Object",
    "lib.jsz.core.HTMLElement",
    "lib.jsz.core.HTMLElementsList",
    "lib.jsz.core.dollar",
    "lib.jsz.core.dom",
    "lib.jsz.core.Listener"
  ]
});