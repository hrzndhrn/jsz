//TODO: Documentation
script({
  name: 'lib.jsz.core.dollar',
  require: [
    'lib.jsz.core.Array',
    'lib.jsz.core.HTMLElement',
    'lib.jsz.core.HTMLElementsList'
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