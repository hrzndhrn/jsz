script({
  name: 'lib.jsz.core.HTMLElement',
  require: [
    'lib.jsz.core.Namespace',
    'lib.jsz.core.jsz'
  ]
}, function () {
  'use strict';

  namespace('jsz').proto('HTMLElement', {

    HTMLElement: function (element, companion) {
      this._element = jsz.default(element, null);
      this._companion = jsz.default(companion, null);
    },

    CUSTOM_ATTRIBUTE_PREFIX: 'data-',
    CUSTOM_JSZ_PREFIX: 'data-jsz-',

    map: function (fun, args) {
      var result = null;
      if (this.isNotEmpty()) {
        result = apply(fun, this._element, args);
      }

      return result;
    },

    isEmpty: function () {
      return this._element === null;
    },

    isNotEmpty: function () {
      return this._element !== null;
    },

    get: function () {
      return this._element;
    },

    append: function(element) {
      return this.map(HTMLElement.prototype.appendChild, [element.get()]);
    },

    setAttribute: function(name, value) {
      return this.map(HTMLElement.prototype.setAttribute, [name, value]);
    },

    setDataAttribute: function(name, value) {
      return this.map(HTMLElement.prototype.setAttribute,
        [this.CUSTOM_ATTRIBUTE_PREFIX + name, value]);
    },

    setJszAttribute: function(name, value) {
      return this.map(HTMLElement.prototype.setAttribute,
        [this.CUSTOM_JSZ_PREFIX + name, value]);
    },

    getAttribute: function(name) {
      return this.map(HTMLElement.prototype.getAttribute, [name]);
    },

    getDataAttribute: function(name) {
      return this.map(HTMLElement.prototype.getAttribute,
        [this.CUSTOM_ATTRIBUTE_PREFIX + name]);
    },

    getJszAttribute: function(name) {
      return this.map(HTMLElement.prototype.getAttribute,
        [this.CUSTOM_JSZ_PREFIX + name]);
    },

    setAttributes: function(attributes) {
      Object.keys(attributes).forEach(function(name) {
        var value = attributes[name];
        if (name.equalIgnoreCase('style')) {
          this.setStyle(value); // TODO: implement setStyle
        }
        else if (name.equalIgnoreCase('aria')) {
          this.setAriaAttributes(value); // TODO: implement setAriaAttributes
        }
        else if (name.equalIgnoreCase('jsz')) {
          this.setJszAttributes(value); // TODO: implement setJszAttributes
        }
        else {
          if (jsz.isArray(value)) {
            value = value.join(JSZ.BLANK);
          }
          this.setAttribute(name, value);
        }
      }, this);
    },

    html: function(html) {
      if (html === undefined) {
        html = this._element.innerHTML;
      }
      else {
        this._element.innerHTML = html;
      }

      return html;
    },

    getId: function () {
      return this.map(HTMLElement.prototype.getAttribute, ['id']);
    },

    setStyle: function (style, value) {
      jsz.dom.setStyle(this._element, style, value);
    },

    hasType: function () {
      return Boolean(
        this.map(HTMLElement.prototype.hasAttribute, ['type'])
      ).valueOf();
    },

    isType: function (type) {
      return this.hasType() &&
        type.equalIgnoreCase(this.getType());
    },

    getType: function () {
      this.map(HTMLElement.prototype.getAttribute, ['type']);
    },

    getCssClasses: function () {
      return this.map(
        HTMLElement.prototype.getAttribute, ['class']).split(JSZ.BLANK);
    },

    addCssClass: function (cssClass) {
      var cssClasses = this.getCssClasses();
      cssClasses.push(cssClass);
      this.map(
        HTMLElement.prototype.setAttribute, ['class',
          cssClasses.join(JSZ.BLANK)]
      );
    },

    removeCssClass: function (cssClass) {
      var cssClasses = this.getCssClasses();
      this.map(
        HTMLElement.prototype.setAttribute, ['class',
          cssClasses.filter(isNotEquals(cssClass)).join(JSZ.BLANK)]
      );
    },

    toggleCssClass: function (cssClassA, cssClassB) {
      if (jsz.isArray(cssClassA)) {
        cssClassB = cssClassA[1];
        cssClassA = cssClassA[0];
      }

      var cssClasses = this.getCssClasses(),
        removeCssClass,
        addCssClass;

      if (cssClasses.contains(cssClassB)) {
        addCssClass = cssClassA;
        removeCssClass = cssClassB;
      }
      else {
        addCssClass = cssClassB;
        removeCssClass = cssClassA;
      }

      cssClasses.push(addCssClass);
      this.map(
        HTMLElement.prototype.setAttribute, ['class',
          cssClasses.filter(isNotEquals(removeCssClass)).join(JSZ.BLANK)]
      );
    },

    /**
     * Adds an event listener of type click to the element.
     */
    onClick: function (fun, scope, config) {
      return jsz.Listener.add(this, 'click', fun, scope, config);
    },

    $: function(selectors) {
      return $(selectors, this);
    },

    $$: function(selectors) {
      return  $$(selectors, this);
    }

  });

  jsz.HTMLElement.build = function(element) {
    return new jsz.HTMLElement(element);
  };

  jsz.HTMLElement.make = function (tagName, attributes, content) {
    if ( arguments.length === 1) {
      attributes = {};
      content = JSZ.EMPTY_STRING;
    }
    else if ( arguments.length === 2) {
      if ( jsz.isString(attributes)) {
        content = attributes;
        attributes = {};
      }
    }

    var element = new jsz.HTMLElement( document.createElement(tagName));
    element.setAttributes(attributes);
    element.html(content);

    return element;
  };

  jsz.HTMLElement.get = function(htmlElement) {
    return htmlElement.get();
  };

  jsz.HTMLElement.empty = new jsz.HTMLElement();
});

