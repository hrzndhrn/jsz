script({
  name: 'test.jsz.core.dollar',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.core').add(
    new jsz.unit.TestCase({
      name: 'dollar',
      setup: function () {
        this.assert = jsz.unit.assert;
      },
      // teardown: function () {},
      methods: {

        byIdNotFound: function() {
          var element = $id('no');
          this.assert.isInstanceOf(element, jsz.HTMLElement);
          this.assert.isTrue(element.isEmpty());
        },

        byIdFound: function () {
          var element = $id('main');
          this.assert.isInstanceOf(element, jsz.HTMLElement);
          this.assert.isFalse(element.isEmpty());
        },

        bySelector: function() {
          var element = $('span.subsub');
          this.assert.isInstanceOf(element, jsz.HTMLElement);
          this.assert.isFalse(element.isEmpty());
        },

        bySelectorAll: function() {
          var elements = $$('span.sub');
          this.assert.isInstanceOf(elements, jsz.HTMLElementsList);
          this.assert.isEqual(elements.size(), 3);
        },

        bySelectorAllRoot: function() {
          var elementsA = $id('sub').$$('span');
          this.assert.isInstanceOf(elementsA, jsz.HTMLElementsList);
          this.assert.isEqual(elementsA.size(), 2);

          var elementsB = $$('#sub span');
          this.assert.isInstanceOf(elementsB, jsz.HTMLElementsList);
          this.assert.isEqual(elementsB.size(), 2);

          this.assert.isEqualArray(
            elementsA.get().map(jsz.HTMLElement.get),
            elementsB.get().map(jsz.HTMLElement.get)
          );
        }

      }
    })
  );

});
