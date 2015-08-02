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
      this._tests = jsz.default(config.tests, []);
      this._methods = jsz.default(config.methods, {});

      Object.keys(this._methods).forEach(this._setupTests, this);
    },

    _setupTests: function(methodName) {
      var contains = this._tests.some( function(test) {
        return test.name === methodName;
      }); 
      
      if ( !contains) {
        this._tests.push({name:methodName});
      }
    },

    _error: null,
    _run: false,
    _ready: false,
    _session: null,
    _environment: {},

    run: function() {
      this._reset();
      this._run = true;

      this._setupTest();

      if ( this._error === null) {
        this._tests.forEach( this._runTest, this);
        this._teardownTest();
      }

      this._ready = true;
    },

    isRunning: function() {
      return this._run && !this._reday;
    },

    isSuccessful: function() {
      var successful = false;
      if ( this._ready && this._error !== null) {
        successful = this._tets.every(function(test) {
          return test.successful;
        });
      }

      return successful;
    },
    
    _reset: function() {
      this._error = null;
      this._run = false;
      this._ready = false;
      this._session = null;
      this._environment = {};

      this._tests.forEach(function(test) {
        delete test.success;
        delete test.fail;
        delete test.error;
      });
    },

    _setupTest: function() {
      try {
        this._setup.apply(this._environment);
      }
      catch(error) {
        this._error = new jsz.Error('Setup of test case ' +
          this._name + ' failed!', error);
      }
    },

    _runTest: function(test) {
      if ( test.skip === true) {
        test.skipped = true;
      }
      else {
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
      }
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
      log.info('TestCase: ' + this.name, false);
      this._tests.forEach(this._logTest, this);
    },

    _logTest: function(test) {
      if ( test.skipped) {
        log.debug('skipped test: ' + test.name, false);
      }
      else if (test.successful) {
        log.success('test: ' + test.name, false);
      }
      else {
        log.error('test: ' + test.name, false);
        log.error(test.error);
      }
    }

  });

})