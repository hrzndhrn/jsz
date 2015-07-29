script({
  name: 'lib.jsz.unit.Session'
}, function () {
  'use strict';

  console.log('eval lib.jsz.unit.Session');

  namespace('jsz.unit').class('Session').def({
    Session: function () {
      this._testCases = [];
      this._testNameRegExp = new RegExp('.*');
    },

    add: function (testCase) {
      this._testCases.push(testCase);
    },

    run: function (testNameRegEx) {
      this._testNameRegExp = new RegExp(jsz.default( testNameRegEx, '.*'));
      this._testCases.forEach(this._runTestCase, this);
      return this;
    },
    
    _runTestCase: function(testCase) {
      if (this._testNameRegExp.test(testCase.name)) {
        testCase.run();
      }
    },

    isSuccessful: function() {
      return this._testCases.every(this._isSuccessfulTestCase, this);
    },

    _isSuccessfulTestCase: function(testCase) {
      var successful = true;
      if (this._testNameRegExp.test(testCase.name)) {
        successful = testCase.isSuccessful();
      }
      return successful;
    },

    log: function() {
      this._testCases.forEach(this._logTestCase, this);
    },

    _logTestCase: function(testCase) {
      testCase.log();
    }

  }).static({
      _defaultSession: null,

      getDefaultSession: function() {
        if (this._defaultSession === null) {
          this._defaultSession = new jsz.unit.Session();
        }
        return this._defaultSession;
      },

      add: function (testCase) {
        return this.getDefaultSession().add(testCase);
      },

      run: function (testName) {
        return this.getDefaultSession().run(testName);
      },

      isSuccessful: function() {
        return this.getDefaultSession().isSuccessful();
      },

      log: function() {
        return this.getDefaultSession().log();
      }

  });

});