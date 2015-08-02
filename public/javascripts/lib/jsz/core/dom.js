/**
 * Some tools for the Document Object Model.
 *
 * @author   Marcus Kruse
 * @version  0.1.0
 *
 */
script({
  name: 'lib.jsz.core.dom',
  require: [
    'lib.jsz.core.Namespace',
    'lib.jsz.core.String'
  ]
}, function () {
  'use strict';

  namespace('jsz').module('dom').def({

    /**
     * The function jsz.dom.setStyle sets a style attribute for an element. The
     * can be set by a key value pair or by an object.
     *
     * @example
     * // e.g. by key value pair
     * jsz.dom.setStyle(element, color, 'green');
     * // e.g. by object
     * jsz.dom.setStyle(element, {color:'green'});
     * 
     * @param {HTMLElement} element
     * @param {String} style
     * @param {Object} style
     * @param {String} [value]
     */
    setStyle: function (element, style, value) {
      if (style !== undefined) {
        if (value !== undefined) {
          // set style by key value pair
          return this._setStyle(element, style, value);
        }
        else {
          // set style by object
          Object.keys(style).forEach(function (key) {
            this._setStyle(element, key, style[key]);
          }, this);
        }
      }
    },

    /**
     * The function jsz.dom._setStyle sets a style attribute for an element.
     *
     * @param {HTMLElement} element
     * @param {String} style
     * @param {String} [value]
     *
     * @todo Test with IE10
     */
    _setStyle: function (element, style, value) {
      if (element) {

        if (typeof element.style === 'undefined') {
          log.error('element.style is undefined! Element: ' + element);
        }

        if (style === 'float') {
          style = 'cssFloat';
        }

        value = this._getStylesDefaultUnit(style, value);

        element.style[style.toCamelCase()] = value;
      } else {
        throw new Error('Can not set style! Element is undefined');
      }

      return element;
    },

    /**
     * The constant jsz.dom.STYLES_DEFAULT_UNIT holds default units for some css
     * attributes. This default will be used bj setStyle if the specified
     * attributes missing an unit.
     */
    STYLES_DEFAULT_UNIT: {
      height: 'em',
      width: 'em',
      top: 'em',
      left: 'em',
      padding: 'em',
      margin: 'em',
      paddingLeft: 'em',
      paddingRight: 'em'
    },

    /**
     * The function jsz.dom._getStyleDefaultUnit extends a value with a unit if
     * the unit is missing. The lookup table is hosted in
     * jsz.dom.STYLES_DEFAULT_UNIT.
     *
     * @param {String} style
     * @param {String} value
     * @returns {String}
     */
    _getStylesDefaultUnit: function (style, value) {
      var unit = this.STYLES_DEFAULT_UNIT[style],
        isNum = /^-?\d*$/.test(value);

      if (typeof unit !== undefined && isNum) {
        return value + unit;
      }

      return value;
    }

  });

});