script({
  name: 'demo.logging',
  require: ['lib.jsz.log','lib.jsz.unit']
}, function () {
  'use strict';

  log.debug('evaluate demo.logging.js');

  log.info('Hello');
  log.warn('Is there anybody out there?');
  log.log('log-log-log');

  jsz.log.setType('stack');

  log.debug('hello, hello');

  jsz.log.setLogTo($id('log'));

  log.debug('log to div');
  var jszError = new jsz.Error();
  log.debug('an error in file ' + jszError.fileName +
    ' at line ' + jszError.lineNumber);
  var error = new Error('bla');
  log.debug('an error stack: ' + error.stack);
  var assertError = new jsz.unit.AssertError();
  log.debug('an error in file ' + assertError.fileName +
    ' at line ' + assertError.lineNumber + ' of type ' + assertError.name);
  console.dir( assertError.stack);

  jsz.log.setType('noop');
  log.debug('Can you hear me?');

  jsz.log.setType('console');

  log.info('good, bye');

});
