/**     _
 *     (_) _________
 *     | |/ _____  /
 *    _| |\__ \ / /_
 *  / _   ____//____|
 * | (_) | Just Another
 *  \___/  JS Framework
 *
 */

(function() {
  'use strict';

  script({
    name: 'lib.jsz.core',
    default: true,
    require: [
      'lib.jsz.config',               // Configuration data.
      'lib.jsz.core.script',          // The script loader.
      'lib.jsz.core.config',          // Configuration for the script load and
                                      // jsz.
      'lib.jsz.core.main',            // some global constants and functions
      'lib.jsz.core.Array',           // Extensions for the built-in Array
      'lib.jsz.core.String',          // Extensions for the built-in String
      'lib.jsz.core.Date',            // Extensions for the built-in Date
      'lib.jsz.core.Function',        // Extensions for the built-in Function
      'lib.jsz.core.JSON',            // Extensions for the built-in JSON
      'lib.jsz.core.Namespace',       // Namespace for classes, modules, ...
      'lib.jsz.core.jsz',             // The jsz-namespace.
      'lib.jsz.core.Object',          // jsz.Object and ext. for the built-in.
      'lib.jsz.core.HTMLElement',     // A wrapper for the HTMLElements.
      'lib.jsz.core.HTMLElementsList',// A wrapper for a list ofr HTMLElements.
      'lib.jsz.core.dollar',          // Functions: $, $id, $$, ...
      'lib.jsz.core.dom',             // Functions to manipulate the DOM.
      'lib.jsz.core.Error',           // The jsz.Error class.
      'lib.jsz.core.Listener',        // Listener: A wrapper for all events.
      'lib.jsz.core.time'             // Some tools to works with dates and time
    ]
  });
})();
