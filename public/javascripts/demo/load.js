script({name: 'demo.load'}, function () {
  'use strict';

  log.debug('evalutae load.js');

  module('demo').def({

    hello: function () {
      alert('Hello!');
    }

  });


});
