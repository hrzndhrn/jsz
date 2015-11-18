/**
 * The base-object for all UI-elements.
 * @version: 0.1.0
 */
script({
  name: 'lib.jsz.ui.Element',
  require: ['lib.jsz.ui.Object']
}, function() {
  'use strict';

  /**
   * The base-object for all UI-elements.
   */
  namespace('jsz.ui').class('Element', jsz.ui.Object).def({

    config: {},

    /*
    Element: function(args) {
      return args;
    }*/
  });

});
