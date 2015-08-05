script({
  name: 'lib.jsz.unit.Session'
}, function () {
  'use strict';

  namespace('jsz.unit').class('Session').def({
    Session: function (name) {
      this.name = name;
      this._testCases = [];
      this._testNameRegExp = new RegExp('.*');
      this._onReady = noop;
    },

    add: function (testCase) {
      testCase.onReady( this._onReadyTestCase, this);
      this._testCases.push(testCase);
      return this;
    },

    run: function (testNameRegEx) {
      if (this._testCases.length === 0) {
        throw new Error('No test cases in this session!');
      }
      this._testNameRegExp = new RegExp(jsz.default( testNameRegEx, '.*'));
      this._testCases.forEach(this._runTestCase, this);
      return this;
    },
    
    _runTestCase: function(testCase) {
      if (this._testNameRegExp.test(testCase.name)) {
        testCase.run();
      }
    },

    onReady: function(fun, scope) {
      this._onReady = unite(fun, scope);
      return this;
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

    _onReadyTestCase: function() {
      if (this.isReady()) {
        this._onReady(this);
      }
    },

    isReady: function() {
      return this._testCases.every(function(testCase) {
        return testCase.isReady();
      });
    },

    log: function() {
      var message = 'TestSession: ' + this.name;
      if ( this.isSuccessful()) {
        log.success(message, false);
      }
      else {
        log.error(message, false);
      }

      this._testCases.forEach(this._logTestCase, this);
    },

    _logTestCase: function(testCase) {
      testCase.log();
    },

    logTo: function(htmlElement) {
      if (this.isReady()) {
        var logType = jsz.log.getType();
        jsz.log.setType('stack');
        jsz.log.setLogTo(htmlElement);
        this.log();
        jsz.log.setType(logType);
      }
      else {
        throw new Error('jsz.unit.Session is not ready!');
      }
    },

    toString: function() {
      return '[' + this.name + JSZ.BLANK + this.getClassName() + ']';
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