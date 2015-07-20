script({name: 'demo.load'}, function () {
  'use strict';

  console.log('evalutae load.js');

  module('demo').def({

    hello: function () {
      alert('Hello!');
    }

  });


});
