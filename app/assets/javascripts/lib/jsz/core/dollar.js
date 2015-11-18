//TODO: Documentation
script({
  name: 'lib.jsz.core.dollar',
  require: [
    'lib.jsz.core.Array',
    'lib.jsz.core.HTMLElement'
  ]
}, function () {
  'use strict';

  /**
   * Returns a reference to the element by its ID.
   *
   * @param {String} id
   * @returns {jsz.HTMLElement}
   */
  window.$id = function (id) {
    return new jsz.HTMLElement(document.getElementById(id));
  };

  /**
   * Returns a reference to to the first element that matches the given
   * selectors.
   *
   * @param {String} [selectors] is a group of selectors to match on.
   * @param {jsz.HTMLElement} [htmlElement=document] is the root element on
   *   which the query starts.
   * @returns {jsz.HTMLElement} Used without parameters, an empty element will
   *   be returned..
   */
  window.$ = function (selectors, htmlElement) {
    var result = jsz.HTMLElement.empty,
      root = null;

    if (arguments.length > 0) {
      if (htmlElement === undefined) {
        root = document;
      }
      else if (!htmlElement.isEmpty()) {
        root = htmlElement.get();
      }

      if (root !== null) {
        result = new jsz.HTMLElement(root.querySelector(selectors));
      }
    }

    return result;
  };

  /**
   * Returns all reference to to the elements that matches the given
   * selectors.
   *
   * @param {String} selectors is a group of selectors to match on.
   * @param {jsz.HTMLElement} [htmlElement=document] is the root element on
   *   which the query starts.
   * @returns {jsz.HTMLElement}
   */
  window.$$ = function (selectors, htmlElement) {
    var result = [],
      root = null;

    if (htmlElement === undefined) {
      root = document;
    }
    else if (!(htmlElement instanceof jsz.HTMLElement)) {
      throw new Error('htmlElement must be of type jsz.HTMLElement!');
    }
    else if (htmlElement.isNotEmpty()){
      root = htmlElement.get();
    }

    if (root !== null) {
      result = Array.from(root.querySelectorAll(selectors))
        .map(jsz.HTMLElement.build);
    }

    return result;
  };


  window.$jsz = function( name, value, htmlElement) {
    var selector = '[data-jsz-' + name + '="' + value + '"]';
    return $(selector, htmlElement);
  };


});