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

    /**
     * The method add adds a new test case to the test session. The test cases
     * will be executed in the same order as they added.
     *
     * @param testCase
     * @returns {jsz.unit.Session}
     */
    add: function (testCase) {
      testCase.onReady( this._onReadyTestCase, this);
      this._testCases.push(testCase);
      return this;
    },


    run: function (testNameRegEx) {
      this._testNameRegExp = new RegExp(jsz.default( testNameRegEx, '.*'));

      var firstTestCase = this._nextTestCase();

      if (firstTestCase === undefined) {
        throw new Error('No test cases in this session!');
      }
      else {
        firstTestCase.run();
      }

      return this;
    },

    /**
     * The method _nextTestCase returns the next unused test case.
     *
     * @returns {jsz.unit.TestCase}
     * @private
     */
    _nextTestCase: function() {
      return this._testCases.find(function(testCase) {
        return this._testNameRegExp.test(testCase.name) && !testCase.isReady();
      }, this);
    },

    /**
     * The method onReady sets the callback that's will be fired if all test
     * cases are ready.
     *
     * @param {Function} fn
     * @param {Object} scope
     * @returns {jsz.unit.Session}
     */
    onReady: function(fn, scope) {
      this._onReady = unite(fn, scope);
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
      else {
        this._nextTestCase().run();
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