script({
  name: 'lib.jsz.unit.AssertError'
}, function() {
  'use strict';

  namespace('jsz.unit').class( 'AssertError', jsz.Error).def({

    AssertError: function(message, skip) {
      this.super(message, skip);
    }
  });
});
