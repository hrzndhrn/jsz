script({
  name:'test.jsz.unit',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function() {
  'use strict';

  log.debug('eval test.jsz.unit');

  log.debug('jsz.unit: ' + jsz.unit);
  log.debug('jsz.unit.assert: ' + jsz.unit.assert);
  log.debug('jsz.unit.TestCase: ' + jsz.unit.TestCase);

});