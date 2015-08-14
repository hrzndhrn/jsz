script({
  name: 'test.itemStore.items',
  require: [
    'lib.jsz.HttpRequest',
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  // The JSON.reviver will be used by jsz.HttpRequest to parse JSON.
  console.log('items.js');
  JSON.reviver = JSON.reviverZuluTime;

  jsz.unit.Session.get('ItemStore').add(
    new jsz.unit.TestCase({
      name: 'ItemStore: get empty list',
      timeout: jsz.time.second().millis(),
      setup: function (testCase) {
        this.assert = jsz.unit.assert;
        this.success = testCase.callback('success');
      },
      tests: [
        {name: 'request'},
        {name: 'success'}
      ],
      methods: {

        request: function () {
          $http.get({
            uri:'/itemStore/items',
            onSuccess: this.success,
            scope: this
          });
        },

        success: function(data) {
          console.log('get empty list');
          console.dir({data:data});
          this.assert.isTrue(data.isEmpty());
        }
      }
    })
  ).add(
    new jsz.unit.TestCase({
        name: 'ItemStore: add new item',
        timeout: jsz.time.second().millis(),
        setup: function (testCase) {
          this.assert = jsz.unit.assert;
          this.success = testCase.callback('success');
        },
        tests: [
          {name: 'request'},
          {name: 'success'}
        ],
        methods: {

          request: function () {
            this.timestamp = Date.now();
            this.item = {
              name: 'foo',
              quantity: 100,
              description: 'foofoo',
              price: 0.99
            };

            $http.post({
              uri:'/itemStore/items',
              onSuccess: this.success,
              scope: this,
              data: this.item
            });
          },

          success: function(data) {
            console.dir({data:data});
            this.assert.isEqual(data.name, this.item.name);
            this.assert.isEqual(data.description, this.item.description);
            this.assert.isEqual(data.price, this.item.price);
            this.assert.isEqual(data.quantity, this.item.quantity);
            this.assert.isTrue( data.updatedAt.getTime() >= this.timestamp);
          }
        }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'ItemStore: get an item',
      timeout: jsz.time.second().millis(),
      setup: function (testCase) {
        this.assert = jsz.unit.assert;
        this.successList = testCase.callback('successList');
        this.successGet = testCase.callback('successGet');
      },
      tests: [
        {name: 'requestList'},
        {name: 'successList'}
      ],
      methods: {

        requestList: function () {
          $http.get({
            uri:'/itemStore/items',
            onSuccess: this.successList,
            scope: this
          });
        },

        successList: function(data) {
          console.log('successList');
          console.dir({data:data});
          this.assert.isTrue(data.isNotEmpty());
          this.item = data[0];
        },

        requestGet: function() {
          $http.get({
            uri:'/itemStore/items',
            onSuccess: this.successGet,
            scope: this,
            data: this.item.id
          });
        },

        successGet: function(data) {
          console.log('successGet');
          console.dir({data:data});
          this.assert.isEqual(data.id, this.item.id);
          this.assert.isEqual(data.name, this.item.name);
          this.assert.isEqual(data.description, this.item.description);
          this.assert.isEqual(data.price, this.item.price);
          this.assert.isEqual(data.quantity, this.item.quantity);
          this.assert.isEqual(data.updatedAt, this.item.updatedAt);

        }
      }
    })
  );

});
