script({
  name: 'test.jsz.core.isType',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.add(
    new jsz.unit.TestCase({
      name: 'jsz.core.isType',
      setup: function () {
        this.assert = jsz.unit.assert;
        this.isFalse = this.assert.isFalse;
        this.isTrue = this.assert.isTrue;
        
        this.anError = new Error('error');
        this.jszError = new jsz.Error('error');
        this.str = 'str';
      },
      methods: {

        isError: function () {
          this.isTrue(jsz.isError(this.anError), 
            'jsz.isError(this.anError)');
          this.isTrue(jsz.isError(this.jszError), 
            'jsz.isError(this.jszError)');
          this.isFalse(jsz.isError(this.str),
            'jsz.isError(this.str)');
        },

        isString: function () {
          this.isFalse(jsz.isString(this.anError),
            'jsz.isString(this.anError)');
          this.isFalse(jsz.isString(this.jszError),
            'jsz.isString(this.jszError)');
          this.isTrue(jsz.isString(this.str),
            'jsz.isError(this.str)');
        }

      }
    })
  );

  jsz.log.setType('stack');
  jsz.log.setLogTo($('div.log'));
  jsz.unit.Session.run().log();

});
