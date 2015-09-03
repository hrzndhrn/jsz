/**     _
 *     (_)________
 *     | / ____  /
 *    _| \__ \/ /
 *  / _   ___/___|
 * | (_) | Just Another
 *  \___/  JavaScript Framework
 *
 */

(function() {
  'use strict';

  script({
    name: 'lib.jsz.core',
    default: true,
    require: [
      'lib.jsz.core.script',
      'lib.jsz.core.init',
      'lib.jsz.core.Array',
      'lib.jsz.core.String',
      'lib.jsz.core.Date',
      'lib.jsz.core.Function',
      'lib.jsz.core.Namespace',
      'lib.jsz.core.jsz',
      'lib.jsz.core.Object',
      'lib.jsz.core.HTMLElement',
      'lib.jsz.core.HTMLElementsList',
      'lib.jsz.core.dollar',
      'lib.jsz.core.dom',
      'lib.jsz.core.Error',
      'lib.jsz.core.JSON',
      'lib.jsz.core.Listener',
      'lib.jsz.core.time'
    ]
  });
})();
