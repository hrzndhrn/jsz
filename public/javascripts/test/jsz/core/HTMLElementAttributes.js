script({
  name: 'test.jsz.core.attributes',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.core').add(
    new jsz.unit.TestCase({
      name: 'HTMLElement:attributes',
      setup: function () {
        this.assert = jsz.unit.assert;
        this.element = $id('attributes');
      },
      // teardown: function () {},
      tests: [
        { name:'readUndefined'},
        { name: 'write'},
        { name: 'read'}
      ],
      methods: {

        readUndefined: function() {
          log.debug('readUndefined');
        },

        read: function () {
          log.debug('read');
        },

        write: function() {
          log.debug('write');
        }

      }
    })
  );

});
