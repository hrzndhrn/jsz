script({
  name: 'lib.jsz.unit.TestCase'
}, function() {
  'use strict';

  namespace('jsz.unit').class( 'TestCase').def({
    TestCase: function(config) {
      this.name = config.name;
      this.skip = jsz.default(config.skip, false);
      this._setup = jsz.default(config.setup, noop);
      this._teardown = jsz.default(config.teardown, noop);
      this._methods = jsz.default(config.methods, {});

      var tests = jsz.default(config.tests, []);
      /**
       * @member {String[]}
       */
      this._testsOrder = tests.map(function(test) {
        return test.name;
      });
      /**
       * @member {{Test}}
       * @typedef {Object} Test
       * @property {String} name matching to the method name in _methods.
       * @property {String} skip
       * @property {String} callback
       */
      this._tests = tests.reduce( function(tests, test) {
        tests[test.name] = test;
        return tests;
      }, {});

      // Add missing methods to tests order and tests.
      Object.keys(this._methods).sort().forEach( function(methodName) {
        if (!this._testsOrder.contains(methodName)) {
          this._testsOrder.push(methodName);
          this._tests[methodName] = {name:methodName};
        }
      }, this);

      // Set defaults for the tests.
      Object.keys(this._tests).forEach(function(testName) {
        this._tests[testName] = jsz.defaults(this._tests[testName], {
          callback: false,
          skip: false
        });
      }, this);
    },

    _error: null,
    _environment: {},
    _interrupted: false,
    _onReady: noop,

    onReady: function(fun, scope) {
      this._onReady = unite(fun, scope);
    },

    run: function() {
      this._reset();
      this._setupTest();
      this._run();
    },

    _run: function() {
      this._interrupted = false;
      if ( this._error === null) {
        var index = 0,
          testCount = this._testsOrder.length;
        for (index; index < testCount; index++) {
          var test = this._tests[this._testsOrder[index]];
          var interrupt = false;
          if ( test.ready === false) {
            interrupt = this._runTest(test, false);
          }

          if (interrupt) {
            this._interrupted = true;
            break;
          }
        }

        if ( this.isReady()) {
          this._teardownTest();
          this._ready();
        }
      }
    },

    isSuccessful: function() {
      var successful = false;

      if ( this._error === null) {
        successful = Object.keys(this._tests).every(function(testName) {
          return this._tests[testName].successful;
        }, this);
      }

      return successful;
    },

    _ready: function() {
      this._onReady(this);
    },

    /**
     * Returns true if whether the test case is ready. If a method name
     * specified then they returns true if the specific test is ready.
     *
     * @param {String} [methodName]
     * @return {boolean}
     */
    isReady: function(methodName) {
      var is;

      if ( this._error === null) {
        if (methodName === undefined) {
          is = Object.keys(this._tests).every(this.isReady, this);
        }
        else {
          is = this._tests[methodName].ready;
        }
      }
      else {
        is = true;
      }

      return is;
    },
    
    _reset: function() {
      this._error = null;
      this._environment = {};
      this._interrupted = false;

      Object.keys(this._tests).forEach(function(testName) {
        var test = this._tests[testName];
        test.successful = null;
        test.skipped = false;
        test.ready = false;
        test.skipped = false;
      }, this);
    },

    _setupTest: function() {
      try {
        this._setup.apply(this._environment, [this]);
      }
      catch(error) {
        this._error = new jsz.Error('Setup of test case ' +
          this._name + ' failed!', error);
        this._onReady(this);
      }
    },

    _runTest: function(test, callback) {
      callback = jsz.default(callback, false);
      var interrupt = false;

      if ( test.skip === true) {
        test.skipped = true;
      }
      else if (test.callback === false || callback === true) {
        var method = this._methods[test.name];
        try {
          method.apply(this._environment);
          test.successful = true;
        }
        catch(error) {
          test.successful = false;
          if ( error instanceof Error) {
            test.error = new jsz.Error(error);
          }
          else {
            test.error = error;
          }
        }
        finally {
          test.ready = true;
        }
      }
      else {
        interrupt = true;
      }

      if (this._interrupted && callback) {
        this._run();
      }

      return interrupt;
    },

    /**
     * Returns a test method as a callback for another test.
     *
     * @param {String} methodName
     * @returns {Funtion}
     */
    callback: function(methodName) {
      var self = this;
      var test = this._tests[methodName];

      test.callback = true;

      return function() {
        self._runTest(test, true);
      };
    },

    _teardownTest: function() {
      try {
        this._teardown.apply(this._enviroment);
      }
      catch(error) {
        this._error = new jsz.Error('Teardown of test case ' +
        this._name + ' failed!', error);
      }
    },

    log: function() {
      var message = 'TestCase: ' + this.name;

      if ( this.isSuccessful()) {
        log.success(message, false);
      }
      else {
        log.error(message, false);
        if (this._error !== null) {
          log.error(this._error);
          if (this._error.causedBy) {
            log.error(this._error.causedBy);
          }
        }
      }

      this._testsOrder.forEach(this._logTest, this);
    },

    _logTest: function(testName) {
      var test = this._tests[testName];
      if ( test.skipped) {
        log.debug('skipped test: ' + test.name, false);
      }
      else if (test.successful) {
        log.success('test: ' + test.name, false);
      }
      else {
        log.error('test: ' + test.name, false);
        if (test.error !== undefined) {
          log.error(test.error);
        }
      }
    },

    toString: function() {
      return '[' + this.name + JSZ.BLANK + this.getClassName() + ']';
    }

  });

})