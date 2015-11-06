/**
 * @author Marcus Kruse
 * @version: 0.1.0
 */
script({
  name: 'lib.jsz.ui.Box',
  require: ['lib.jsz.ui.Object']
}, function() {
  'use strict';

  /**
   * The UI-element Box.
   */
  namespace('jsz.ui').class('Box', jsz.ui.Object).def({
    /** @member element The root element of the ui-element. */
    Box: function() {
      log.debug('constructor Box');
      this.super(Array.from(arguments));
    }
  });

});
