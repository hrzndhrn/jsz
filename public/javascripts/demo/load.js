script({
  name: 'demo.load',
  require: ['lib.jsz.log']
}, function () {
  'use strict';

  log.debug('evalutae load.js');

  module('demo').def({

    hello: function () {
      alert('Hello!');
    }

  });

});
