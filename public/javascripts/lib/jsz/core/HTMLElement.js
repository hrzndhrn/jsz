/**
 * This script holds the jsz.HTMLElement class.
 *
 * @author   Marcus Kruse
 * @version  0.1.0
 */
script({
  name: 'lib.jsz.core.HTMLElement',
  require: [
    'lib.jsz.core.Namespace',
    'lib.jsz.core.jsz'
  ]
}, function () {
  'use strict';

  /**
   * The jsz.HTMLElement class is a wrapper for all html elements.
   */
  namespace('jsz').proto('HTMLElement', {

    /**
     * The constructor to wrap a html element.
     *
     * @param {HTMLElement} element
     */
    HTMLElement: function (element) {
      this._element = jsz.default(element, null);
    },

    /**
     * A constant for the prefix of custom attributes in HTML.
     * @const {String}
     */
    CUSTOM_ATTRIBUTE_PREFIX: 'data-',
    /**
     * A constant for the prefix of custom jsz-attributes in HTML.
     * @const {String}
     */
    CUSTOM_JSZ_PREFIX: 'data-jsz-',

    /**
     * This function calls a given function with the wrapped element as scope.
     * If the jsz.HTMLElement is empty this methods returns null.
     * 
     * @param {Function} fun
     * @param {Array} args
     * @returns {*}
     */
    _apply: function (fun, args) {
      var result = null;
      if (this.isNotEmpty()) {
        result = apply(fun, this._element, args);
      }

      return result;
    },

    /**
     * isEmpty returns true if the wrapped element is null.
     *
     * @returns {boolean}
     */
    isEmpty: function () {
      return this._element === null;
    },

    /**
     * isNotEmpty returns true if the wrapped element is not null.
     *
     * @returns {boolean}
     */
    isNotEmpty: function () {
      return this._element !== null;
    },

    /**
     * The method get returns the wrapped element or null if the jsz.HTMLElement
     * is empty.
     *
     * @returns {HTMLElement|null}
     */
    get: function () {
      return this._element;
    },

    /**
     * The jsz.HTMLElement.append method adds a jsz.HTMLElement to
     * the end of the list of children of this jsz.HTMLElement.
     *
     * @param {jsz.HTMLElement} element
     * @returns {*}
     */
    append: function(element) {
      return this._apply(HTMLElement.prototype.appendChild, [element.get()]);
    },

    /**
     * Adds a new attribute or changes the value of an existing attribute.
     * @example
     * <button id="foo">Hello</button>
     * @example
     * $id('foo').setAttribute('disabled', 'disabled');
     *
     * @param {String} name
     * @param {String} value
     * @returns {*}
     */
    setAttribute: function(name, value) {
      return this._apply(HTMLElement.prototype.setAttribute, [name, value]);
    },

    /**
     * Adds a new custom attribute or changes the value of an existing custom
     * attribute.
     * @example
     * <button id="foo" data-my="world">Hello</button>
     * @example
     * $id('foo').setCustomAttribute('my', 'universe');
     *
     * @param {String} name
     * @param {String} value
     * @returns {*}
     */
    setCustomAttribute: function(name, value) {
      return this._apply(HTMLElement.prototype.setAttribute,
        [this.CUSTOM_ATTRIBUTE_PREFIX + name, value]);
    },

    /**
     * Adds a new jsz-attribute or changes the value of an existing
     * jsz-attribute.
     * @example
     * <button id="foo" data-jsz-my="world">Hello</button>
     * @example
     * $id('foo').setJszAttribute('my', 'universe');
     *
     * @param {String} name
     * @param {String} value
     * @returns {*}
     */
    setJszAttribute: function(name, value) {
      return this._apply(HTMLElement.prototype.setAttribute,
        [this.CUSTOM_JSZ_PREFIX + name, value]);
    },

    /**
     * This method returns the value of a specified attribute.
     *
     * @param {String} name
     * @returns {String|null}
     */
    getAttribute: function(name) {
      var value = this._apply(HTMLElement.prototype.getAttribute, [name]);
      return value === JSZ.EMPTY_STRING ? null : value;
    },

    /**
     * This method returns the value of a specified custom attribute.
     * @example
     * <button id="foo" data-my="world">Hello</button>
     * @example
     * $id('foo').getCustomAttribute('my'); // returns 'world'
     *
     * @param {String} name
     * @returns {String|null}
     */
    getCustomAttribute: function(name) {
      var value = this._apply(HTMLElement.prototype.getAttribute,
        [this.CUSTOM_ATTRIBUTE_PREFIX + name]);
      return value === JSZ.EMPTY_STRING ? null : value;
    },

    /**
     * This method returns the value of a specified jsz-attribute.
     * @example
     * <button id="foo" data-jsz-my="world">Hello</button>
     * @example
     * $id('foo').getJszAttribute('my'); // returns 'world'
     *
     * @param {String} name
     * @returns {String|null}
     */
    getJszAttribute: function(name) {
      var value = this._apply(HTMLElement.prototype.getAttribute,
        [this.CUSTOM_JSZ_PREFIX + name]);
      return value === JSZ.EMPTY_STRING ? null : value;
    },

    /**
     * This methods set several attributes specified by a hash object.
     *
     * @todo documentation and example
     *
     * @param {Object} attributes
     */
    setAttributes: function(attributes) {
      Object.keys(attributes).forEach(function(name) {
        var value = attributes[name];
        if (name.equalsIgnoreCase('style')) {
          this.setStyles(value); // TODO: implement setStyles
        }
        else if (name.equalsIgnoreCase('jsz')) {
          this.setJszAttributes(value);
        }
        else if (name.equalsIgnoreCase('custom')) {
          this.setCustomAttributes(value);
        }
        else {
          if (jsz.isArray(value)) {
            value = value.join(JSZ.BLANK);
          }
          this.setAttribute(name, value);
        }
      }, this);
    },

    setJszAttributes: function(attributes) {
      Object.keys(attributes).forEach(function(name) {
        var value = attributes[name];
        this.setJszAttribute(name, value);
      }, this);
    },

    setCustomAttributes: function(attributes) {
      Object.keys(attributes).forEach(function(name) {
        var value = attributes[name];
        this.setCustomAttribute(name, value);
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
      return this._apply(HTMLElement.prototype.getAttribute, ['id']);
    },

    setStyle: function (style, value) {
      jsz.dom.setStyle(this._element, style, value);
    },

    setStyles: function(object) {
      // TODO: implement setStyles
    },

    hasType: function () {
      return Boolean(
        this._apply(HTMLElement.prototype.hasAttribute, ['type'])
      ).valueOf();
    },

    isType: function (type) {
      return this.hasType() &&
        type.equalsIgnoreCase(this.getType());
    },

    getType: function () {
      this._apply(HTMLElement.prototype.getAttribute, ['type']);
    },

    getCssClasses: function () {
      return this._apply(
        HTMLElement.prototype.getAttribute, ['class']).split(JSZ.BLANK);
    },

    addCssClass: function (cssClass) {
      var cssClasses = this.getCssClasses();
      cssClasses.push(cssClass);
      this._apply(
        HTMLElement.prototype.setAttribute, ['class',
          cssClasses.join(JSZ.BLANK)]
      );
    },

    removeCssClass: function (cssClass) {
      if (arguments.length > 1) {
        this.removeCssClasses(Array.from(arguments));
      }
      else {
        var cssClasses = this.getCssClasses();
        this._apply(
          HTMLElement.prototype.setAttribute, ['class',
            cssClasses.filter(isNotEqual(cssClass)).join(JSZ.BLANK)]
        );
      }
    },

    removeCssClasses: function(cssClasses) {
      cssClasses.forEach( function(cssClass) {
        this.removeCssClass(cssClass);
      }, this);
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
      this._apply(
        HTMLElement.prototype.setAttribute, ['class',
          cssClasses.filter(isNotEqual(removeCssClass)).join(JSZ.BLANK)]
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

