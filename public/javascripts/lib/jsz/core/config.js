(function() {
  'use strict';

  // A workaround for the safari browser.
  if (console !== undefined) {
    // console.clear();
  }

  // cehck config and set default
  var config;
  if (window.jsz === undefined) {
    config = {};
  }
  else {
    config = window.jsz;
    delete window.jsz;
  }

  /**
   * A namespace for jsz meta-data and configuration.
   */
  window._jsz_ = {
    classes: {},
    version: '0.0.1',
    uniqueId: 0,
    sealObjects: true,
    config: {}
  };

  // ---------------------------------------------------------------------------
  // configuration

  // log
  if (config.log === undefined) {
    _jsz_.config.log = {};
  }
  else {
    _jsz_.config.log = config.log;
  }

  // script
  if (config.script === undefined) {
    _jsz_.config.script = {};
  }
  else {
    _jsz_.config.script = config.script;
    _jsz_.config.script.preloaded = [
      'lib.jsz.config',
      'lib.jsz.core.script',
      'lib.jsz.core.config'
    ];

    script.init(_jsz_.config.script);
  }

})();