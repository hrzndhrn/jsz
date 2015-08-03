script({
  name: 'test.jsz.core.HTMLElementAttributes',
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
        { name: 'readUndefined'},
        { name: 'write'},
        { name: 'read'},
        { name: 'writeMulti'},
        { name: 'readMulti'}
      ],
      methods: {

        readUndefined: function() {
          this.assert.isNull(this.element.getAttribute('align'));
          this.assert.isNull(this.element.getCustomAttribute('foo'));
          this.assert.isNull(this.element.getJszAttribute('bar'));
        },

        read: function () {
          this.assert.equals(this.element.getAttribute('align'), 'left');
          this.assert.equals(this.element.getCustomAttribute('foo'), 'foo');
          this.assert.equals(this.element.getJszAttribute('bar'), 'bar');
        },

        write: function() {
          this.element.setAttribute('align', 'left');
          this.element.setCustomAttribute('foo', 'foo');
          this.element.setJszAttribute('bar','bar');
        },

        writeMulti: function() {
          this.element.setAttributes({
            align: 'right',
            jsz: {
              bar: 'foo'
            },
            custom: {
              foo: 'bar'
            }
          });
        },

        readMulti: function() {
          this.assert.equals(this.element.getAttribute('align'), 'right');
          this.assert.equals(this.element.getJszAttribute('bar'), 'foo');
          this.assert.equals(this.element.getCustomAttribute('foo'), 'bar');
        }

      }
    })
  );

});
