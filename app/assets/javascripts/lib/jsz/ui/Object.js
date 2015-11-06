/**
 * The base-object for all UI-objects.
 * @version: 0.1.0
 */
script({
  name: 'lib.jsz.ui.Object'
}, function() {
  'use strict';

  /**
   * The base-object for all UI-objects.
   */
  namespace('jsz.ui').class('Object').def({
    /** @member element The root element of the ui-element. */
    element: $(),

    Object: function() {
      log.debug('conctructor Object');
    }
  });

});
