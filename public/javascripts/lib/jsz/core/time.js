script({
  name: 'lib.jsz.core.time',
  require: [
    'lib.jsz.core.Namespace',
    'lib.jsz.core.Object',
    'lib.jsz.core.Date'
  ]
}, function () {
  'use strict';

  namespace('jsz').module('time').def({

    second: function() {
      return new jsz.time.Seconds(1);
    },

    seconds: function(seconds) {
      return new jsz.time.Seconds(seconds);
    }

  });

  namespace('jsz.time').class('Seconds').def({

    Seconds: function(seconds) {
      this._seconds = seconds;
    },

    millis: function() {
      return this._seconds * Date.MILLIS_PER_SECOND;
    }
  });

});

