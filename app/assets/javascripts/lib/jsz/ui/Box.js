/**
 * @author Marcus Kruse
 * @version: 0.1.0
 */
script({
  name: 'lib.jsz.ui.Box',
  require: ['lib.jsz.ui.Component']
}, function() {
  'use strict';

  /**
   * The UI-element Box.
   */
  namespace('jsz.ui').class('Box', jsz.ui.Component).def({

    cssClass: 'box',

    init: function() {

      log.debug('init box <<<<');
      var template = this.getClass().template;

      if (template.isEmpty()) {
        throw new Error('Template for jsz.ui.Box not found!');
      }
      log.debug(template);
      log.debug('=====');
      log.dir(this);
      if ( this._element.isEmpty()) {
        log.debug('new div');
        this._element = jsz.HTMLElement.create('div');
      }

      this._element.addCssClass(this.cssClass);

      this._element.import(template);


    }

  });

});
