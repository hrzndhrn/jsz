/**
 * A little demo for a click listener.
 */
script({name:'demo.click'}, function () {
  'use strict';

  jsz.Listener.add('foo1', 'click', function () {
    alert('hello');
  });

  $id('foo2').onClick(function () {
    alert('hi');
  });

  function alertId(htmlElement) {
    alert('id: ' + htmlElement.getId());
  }

  jsz.Listener.add('foo3', 'click', alertId, {returnType: 'element'});

  $$('.foo').onClick(alertId, {returnType: 'element'});

});
