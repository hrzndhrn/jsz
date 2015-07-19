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
  EMPTY_STRING: "",
  DOT: ".",
  BLANK: " "
};

/** Detect the base of the jsz-lib
 */
_jsz_.scriptBase = (function () {
  var scripts = document.getElementsByTagName('script'),
    scriptsCount = scripts.length,
    path = JSZ.EMPTY_STRING,
    coreRegEx = new RegExp('http.*\/\/[^\/]*(.*\/)lib\/jsz\/core.*.js'),
    i = 0;

  for (i; i < scriptsCount; i++) {
    var result = coreRegEx.exec(scripts.item(i).src);
    if (result !== null) {
      path = result[1];
      break;
    }
  }

  return path;
}());

/**
 * This functions joins an scope with a function. In most cases this will be an object and one of his
 * methods.
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


/** Adds a new script tag to the head of the site.
 */

script = function (conf, fun) {
  conf.fun = fun;
  conf.evaluated = false;
  conf.loaded = true;

  if (conf.require === undefined) {
    conf.require = [];
  }

  if (conf.name === undefined && script._last === null) {
    script._last = conf;
  }
  else {
    if ( conf.name === undefined) {
      var aux = conf;
      conf = script._last;
      script._last = aux;
      conf.name = script._nameless + script._counter++;
    }
    conf.require = script._defaultRequirements.concat(conf.require);
    script.list[conf.name] = conf;
    script._defaultRequirement(conf.name);
    delete conf.name;
    Object.keys(script.list).forEach(script._eval);
  }

};

script.list = {};

script._last = null;
script._loadedScriptName = null;
script._defaultRequirements = [];
script._base = _jsz_.scriptBase;
script._counter = 0;
script._nameless = 'script-';

script.init = function (conf, fun) {
  if (conf.defaultRequirements !== undefined) {
    script._defaultRequirements = script._defaultRequirements.concat(conf.defaultRequirements);
    delete conf.defaultRequirements;
  }

  if (fun === undefined) {
    fun = function () {
    };
  }

  script(conf, fun);
};

script.load = function (scriptName) {
  var scriptTag = document.createElement('script');

  scriptTag.setAttribute("src", script._base + scriptName);
  scriptTag.setAttribute("type", "text/javascript");
  scriptTag.onload = script._onLoaded(scriptName);

  document.head.appendChild(scriptTag);

  var conf = {loaded: false, evaluated: false};
  script.list[scriptName] = conf;
  return conf;
};

script._onLoaded = function (scriptName) {
  return function () {
    if (script._last === null) {
      throw new Error("Can not find script '" + scriptName + "'!");
    }
    else {
      script.list[scriptName] = script._last;
      script._last = null;

      script._addDefaultRequirements(scriptName);

      script._defaultRequirement(scriptName);

      Object.keys(script.list).forEach(script._eval);
    }
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

script._eval = function (scriptName) {
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

  return scriptObject.evaluated;
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
  name: "lib/jsz/core.js",
  default: true,
  require: [
    "lib/jsz/core/Array.js",
    "lib/jsz/core/String.js",
    "lib/jsz/core/Function.js",
    "lib/jsz/core/Namespace.js",
    "lib/jsz/core/type.js",
    "lib/jsz/core/Object.js",
    "lib/jsz/core/HTMLElement.js",
    "lib/jsz/core/HTMLElementsList.js",
    "lib/jsz/core/dollar.js",
    "lib/jsz/core/dom.js",
    "lib/jsz/core/Listener.js"
  ]
});