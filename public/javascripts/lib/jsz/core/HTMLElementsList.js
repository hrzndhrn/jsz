script({
  name: 'lib.jsz.core.HTMLElementsList',
  require: ['lib.jsz.core.Namespace']
}, function () {
  'use strict';

  namespace('jsz').proto('HTMLElementsList', {

    HTMLElementsList: function (elements) {
      this._elements = jsz.default(elements, []);
    },

    _apply: function (fun, scope, args) {
      this._elements.forEach(function (element) {
        args.unshift(element);
        fun.apply(scope, args);
      });
    },

    map: function (fun, args) {
      this._elements.forEach(function (element) {
        fun.apply(element, args);
      });
    },

    get: function (index) {
      var result;

      if ( index === undefined) {
        result = this._elements;
      }
      else {
        result = this._elements[index];
      }
      return result;
    },

    setStyle: function (style, value) {
      this._apply(jsz.dom.setStyle, jsz.dom, [style, value]);
    },

    isEmpty: function () {
      return this._elements.isEmpty();
    },

    forEach: function (fun, scope) {
      this._elements.forEach(fun, scope);
    },

    indexOf: function (element, fromIndex) {
      return this._elements.indexOf(element, fromIndex);
    },

    /** Adds an event listener of type click to all elements.
     */
    onClick: function (fun, scope, config) {
      this.map(jsz.HTMLElement.prototype.onClick, [fun, scope, config]);
    },

    size: function() {
      return this._elements.length;
    }

  });

  jsz.HTMLElementsList.empty = new jsz.HTMLElementsList();

});

