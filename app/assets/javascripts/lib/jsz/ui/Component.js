/**
 * The base-object for all UI-objects.
 * @version: 0.1.0
 */
script({
  name: 'lib.jsz.ui.Component'
}, function() {
  'use strict';

  /**
   * The base-object for all UI-objects.
   */
  namespace('jsz.ui').class('Component').def({
    /** @member _element The root element of the ui-element. */
    _element: $(),

    xyz: 'xyz',

    Component: function() {
      log.debug('>>>>>>>>>> conctructor Component: ' + this.getClassName());
      log.dir(this);
      log.dir({arguments:Array.from(arguments)});
      var args = Array.from(arguments);
      var config = {};

      if (args.length === 0) {

      }

      this.init.apply(this, config);
    },

    init: function() {},

    getElement: function() {
      return this._element;
    }

  }).static({
    Component: function() {
      this.template = $id(this.getClassName());
    }
  });

});
