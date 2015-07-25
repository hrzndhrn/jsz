/**
 * Some toold for the dom
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

    setStyle: function (element, style, value) {
      if (style === undefined) {
        element.removeAttribute('style');
      }
      else {
        if (value !== undefined) {
          return this._setStyle(element, style, value);
        }

        Object.keys(style).forEach(function (key) {
          this._setStyle(element, key, style[key]);
        }, this);
      }
    },

    // TODO: Test with IE10
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

    _stylesDefaultUnit: {
      height: 'px',
      width: 'px',
      top: 'px',
      left: 'px',
      padding: 'px',
      margin: 'px',
      paddingLeft: 'px',
      paddingRight: 'px'
    },

    _getStylesDefaultUnit: function (style, value) {
      var unit = this._stylesDefaultUnit[style];
      var isNum = /^-?\d*$/.test(value);

      if (typeof unit === 'undefined' || !isNum) {
        return value;
      }

      return value + unit;
    }

  });

});