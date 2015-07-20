//TODO: Documentation
script({
  require: [
    'lib/jsz/core/Array.js',
    'lib/jsz/core/HTMLElement.js',
    'lib/jsz/core/HTMLElementsList.js'
  ]
}, function () {
  'use strict';

  window.$id = function (id) {
    return new jsz.HTMLElement(document.getElementById(id));
  };

  window.$ = function (selectors, element) {
    if (element === undefined) {
      element = document;
    }

    return new jsz.HTMLElement(element.querySelector(selectors));
  };

  window.$$ = function (selectors, element) {
    if (element === undefined) {
      element = document;
    }

    return new jsz.HTMLElementsList(
      Array.fromNodeList(element.querySelectorAll(selectors))
        .map(jsz.HTMLElement.create)
    );
  };

});