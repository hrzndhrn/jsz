script({
  name: 'test.jsz.core.JSON',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.core').add(
    new jsz.unit.TestCase({
      name: 'without default reviver',
      setup: function() {
        this.assert = jsz.unit.assert;
      },
      methods: {
        parse: function() {
          var date = new Date();
          var jsonString = JSON.stringify({date:date});
          var jsonObject = JSON.parse(jsonString);
          // Check if jsonObject.date is the string representation of
          // date.toISOString.
          this.assert.isEqual(date.toISOString(), jsonObject.date);
        }
      }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'with default reviver',
      setup: function() {
        this.assert = jsz.unit.assert;
        // Set default JSON.reviver to JSON.reviverZuluTime.
        JSON.reviver = JSON.reviverZuluTime;
      },
      teardown: function() {
        JSON.reviver = null;
      },
      methods: {
        parse: function() {
          var object = {
            date: new Date(),
            value: 3,
            str: '3'
          };

          var jsonString = JSON.stringify(object);
          var jsonObject = JSON.parse(jsonString);
          // check if jsonObject.date is a date.
          this.assert.isEqual(object.date, jsonObject.date);
          // jsonObject.value should be '3'
          this.assert.isEqual(jsonObject.value, 3);
          this.assert.isEqual(jsonObject.str, '3');
        },

        reviverInt: function() {
          // Call JSON.parse with a reviver that will parse integers and add
          // this values one.
          var reviverAddOne = JSON.reviverRegExpValue(/^\d+$/, function(value) {
            return parseInt(value, 10) + 1;
          });

          var object = {
            date: new Date(),
            value: 3,
            str: '3'
          };

          var jsonString = JSON.stringify(object);
          var jsonObject = JSON.parse(jsonString, reviverAddOne);

          // Check if jsonObject.date is the string representation of
          // date.toISOString. The default reviver was not active.
          this.assert.isEqual(object.date.toISOString(), jsonObject.date);
          // object.value should be 4
          this.assert.isEqual(jsonObject.value, 4);
          this.assert.isEqual(jsonObject.str, 4);
        }

      }
    })
  );

});
