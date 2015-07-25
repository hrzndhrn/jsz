script({
  name: 'demo.logging',
  require: ['lib.jsz.log']
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

  jsz.log.setType('noop');
  log.debug('Can you hear me?');

  jsz.log.setType('console');

  log.dir({stack:jsz.log.getStack()});

  log.info('good, bye');

});
