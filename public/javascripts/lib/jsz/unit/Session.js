script({
  name: 'lib.jsz.unit.Session'
}, function () {
  'use strict';

  namespace('jsz.unit').class('Session').def({
    Session: function (name) {
      this.name = name;
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
      log.info('TestSession: ' + this.name, false);
      this._testCases.forEach(this._logTestCase, this);
    },

    _logTestCase: function(testCase) {
      testCase.log();
    },

    logTo: function(htmlElement) {
      jsz.log.setType('stack');
      jsz.log.setLogTo(htmlElement);
      this.log();
    }

  }).static({
      _sessions: {},
      DEFAULT_SESSION_NAME: 'default',

      getDefaultSession: function() {
        return this.get(this.DEFAULT_SESSION_NAME);
      },
    
      get: function(name) {
        if (this._sessions[name] === undefined) {
          this._sessions[name] =
            new jsz.unit.Session(name);
        }
        return this._sessions[name];
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