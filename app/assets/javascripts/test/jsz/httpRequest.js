script({
  name: 'test.jsz.httpRequest',
  require: [
    'lib.jsz.HttpRequest',
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.HttpRequest').add(
    new jsz.unit.TestCase({
      name: 'http:reverse01',
      timeout: jsz.time.second().millis(),
      setup: function (testCase) {
        this.assert = jsz.unit.assert;

        this.reverse = new jsz.HttpRequest({
          uri:'/json/reverse',
          onSuccess: testCase.callback('success')
        });
      },
      tests: [
        {name: 'request'},
        {name: 'success'}
      ],
      methods: {

        request: function () {
          this.reverse.send({text:'foobar'});
        },

        success: function(data) {
          this.assert.isEqual('raboof', data.text);
        }

      }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'http:reverse02',
      setup: function (testCase) {
        this.assert = jsz.unit.assert;

        this.testSuccess = testCase.callback('success');

        this.onSuccess = function(data) {
          this.testSuccess(data);
        };
      },
      timeout: jsz.time.second().millis(),
      tests: [
        {name: 'request'},
        {name: 'success'}
      ],
      methods: {

        request: function () {
          $http.post({
            uri:'/json/reverse',
            onSuccess: this.onSuccess,
            scope: this,
            data: {text:'abc'}
          });
        },

        success: function(data) {
          this.assert.isEqual('cba', data.text);
        }

      }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'http:reverse03',
      setup: function (testCase) {
        this.assert = jsz.unit.assert;

        this.testSuccess = testCase.callback('success');

        this.onSuccess = function(data) {
          this.testSuccess(data);
        };
      },
      timeout: 1000,
      tests: [
        {name: 'request'},
        {name: 'success'}
      ],
      methods: {

        request: function () {
          $http.post({
            uri:'/json/reverse',
            data: {text:'xyz'}
          }).onSuccess( this.onSuccess, this);
        },

        success: function(data) {
          this.assert.isEqual('zyx', data.text);
        }

      }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'http:abort',
      setup: function (testCase) {
        // activate onLoading on jsz.HttpRequest
        jsz.HttpRequest.ON_LOADING = true;

        this.assert = jsz.unit.assert;

        this.testAbort = testCase.callback('abort');

        this.onSuccess = function() {
          throw new Error('Never reached!');
        };

        this.onLoading = function() {
          this.testAbort();
        };
      },
      timeout: jsz.time.second().millis(),
      tests: [
        {name: 'request'},
        {name: 'abort'}
      ],
      methods: {

        request: function () {
          this.request = $http.post({
            uri:'/json/reverse',
            onLoading: this.onLoading,
            scope: this,
            data: {text:'abort'}
          }).onSuccess( this.onSuccess, this);
        },

        abort: function() {
          this.request.abort();
        }

      }
    })
  );

});
