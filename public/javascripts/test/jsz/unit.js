script({
  name:'test.jsz.unit',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function() {
  'use strict';

  log.debug('eval test.jsz.unit');

  var err = new jsz.unit.AssertError('error');
  log.debug(err);

  console.log( 'err instanceof jsz.unit.AssertError: ' +
    (err instanceof jsz.unit.AssertError));

  console.log( 'err instanceof jsz.Error: ' +
    (err instanceof jsz.Error));

  console.log( 'err instanceof Error: ' +
    (err instanceof Error));

  console.log( 'err instanceof jsz.Object: ' +
    (err instanceof jsz.Object));

  try {
    jsz.unit.assert.equals(2,3,'2 is not 3');
  }
  catch(error) {
    log.debug(error.toString());
  }

  console.log('--- end ---');
});