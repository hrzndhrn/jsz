script({
  name: 'test.jsz.observer.snapshot',
  require: [
    'lib.jsz.Observer',
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.Observer').add(
    new jsz.unit.TestCase({
      name: 'internal',
      setup: function() {
        this.assert = jsz.unit.assert;
      },
      tests: [
        {name: 'create'},
        {name: 'hasNoChanges'},
        {name: 'hasChanges'},
        {name: 'snapshot'}
      ],
      methods: {
        create: function() {
          this.internal = new jsz.Observer({
              data: {
                a:1,b:2,c:{d:4,e:5}
              }
            }
          );

          this.external = {
            a:1,b:2,c:{d:4,e:5}
          };

          this.observer = new jsz.Observer(this.external, {});

          this.assert.isDefined(this.internal);
          this.assert.isDefined(this.external);
          this.assert.throwsError(function() {
            this.internal.x = 42;
          }, this);
          this.assert.throwsError(function() {
            this.external.x = 42;
          }, this);
          this.assert.isEqualArray(
            Object.keys(this.internal).sort(), ['a','b','c']);
          this.assert.isEqualArray(
            Object.keys(this.external).sort(), ['a','b','c']);
        },

        hasNoChanges: function() {
          this.assert.isTrue(this.internal.hasNoChanges());
          this.assert.isFalse(this.internal.hasChanges());

          this.assert.throwsError(function() {
            this.external.hasNoChanges();
          }, this);

          this.assert.isTrue(this.observer.hasNoChanges());
          this.assert.isFalse(this.observer.hasChanges());
        },

        hasChanges: function() {
          this.internal.c.e = 42;
          this.external.c.e = 42;

          this.assert.isTrue(this.internal.hasChanges());
          this.assert.isFalse(this.internal.hasNoChanges());

          this.assert.throwsError(function() {
            this.external.hasChanges();
          }, this);

          this.assert.isTrue(this.observer.hasChanges());
          this.assert.isFalse(this.observer.hasNoChanges());
        },

        snapshot: function() {
          this.internal.snapshot();
          this.observer.snapshot();

          this.assert.isTrue(this.internal.hasNoChanges());
          this.assert.isFalse(this.internal.hasChanges());

          this.assert.isTrue(this.observer.hasNoChanges());
          this.assert.isFalse(this.observer.hasChanges());
        }
      }
    })
  );

});
