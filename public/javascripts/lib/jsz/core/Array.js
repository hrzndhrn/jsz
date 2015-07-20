script({name:'lib.jsz.core.Array'}, function () {
  'use strict';

  Array.fromArguments = function (args) {
    var newArray = [],
      n = args.length,
      i = 0;

    for (i; i < n; i++) {
      newArray.push(args[i]);
    }

    return newArray;
  };

  Array.fromNodeList = function (nodeList) {
    var newArray = [],
      n = nodeList.length,
      i = 0;

    for (i; i < n; i++) {
      newArray.push(nodeList.item(i));
    }

    return newArray;
  };

  Array.prototype.isEmpty = function () {
    return this.length === 0;
  };

  Array.prototype.contains = function () {
    if (jsz.isFunction(arguments[0])) {
      // This is just an alias for some.
      return this.some.apply(this, arguments);
    }
    else {
      // Value must be a type that can be handled by ===
      var value = arguments[0];
      return this.some(isEqual(value));
    }
  };

});
