script({
  name: 'lib.jsz.unit.Session'
}, function () {
  'use strict';

  console.log('eval lib.jsz.unit.Session');

  namespace('jsz.unit').class('Session').def({
    Session: function () {
      this._tests = [];
      this._onReady = noop;
    },

    add: function (test) {
      test.session(this);
      this._tests.push(test);
      // test.run();
    },

    run: function (testName) {
      // log.debug("run", this);
      for (var i = 0; i < this._tests.length; i++) {
        if (typeof testName === 'undefined') {
          // log.debug("run test: " + this._tests[i].name(), this);
          this._tests[i].run();
        }
        else {
          if (typeof this._tests[i].name() !== 'undefined') {
            if (this._tests[i].name().startsWith(testName) &&
              this._tests[i].isActive()) {
              // log.debug("run test: " + this._tests[i].name(), this);
              this._tests[i].run();
            }
            else {
              this._tests[i].skip();
            }
          }
        }
      }

      return this;
    },

    onReady: function (onReady, scope) {
      this._onReady = unite(onReady, scope);
      this.ready();
      return this;
    },

    ready: function () {
      if (this.isReady()) {
        this._onReady(this);
        // reset testcases
        for (var i = 0; i < this._tests.length; i++) {
          this._tests[i].resetReady();
        }
      }
    },

    wasSuccessfully: function () {
      var countFailed = 0;

      for (var i = 0; i < this._tests.length; i++) {
        if (this._tests[i].ran()) {
          if (!this._tests[i].successful()) {
            countFailed++;
          }
        }
      }

      return countFailed === 0;
    },

    isReady: function () {
      var ready = true;

      for (var i = 0; i < this._tests.length; i++) {
        if (this._tests[i].ran() && !this._tests[i].isReady()) {
          // log.dir(this._tests[i]);
          ready = false;
          break;
        }
      }

      return ready;
    },

    report: function (level) { // level = [min|short|long]
      var countFailed = 0;
      var countTestCases = 0;

      level = jsz.default(level, 'long');
      var string = '';

      if (level === 'long') {
        string = '\njsz.unit.Session\n' + '================\n';
      }
      else {
        string = 'jsz.unit.Session\n';
      }

      for (var i = 0; i < this._tests.length; i++) {
        if (this._tests[i].ran()) {
          if (level === 'long') {
            string += this._tests[i].report();
          }
          countTestCases++;
          if (!this._tests[i].successful()) {
            countFailed++;
          }
        }
      }

      if (level === 'long') {
        string += '================\n';
      }
      string += 'TestCases: ' + countTestCases + '\n';
      string += 'Failed   : ' + countFailed + '\n';

      if (level === 'min') {
        if (countFailed === 0) {
          string = 'successful';
        }
        else {
          string = 'failed';
        }
      }

      return string;
    }
  }).static({
      _defaultSession: null,

      add: function (test) {
        if (this._defaultSession === null) {
          this._defaultSession = new jsz.unit.Session();
        }
        this._defaultSession.add(test);
      },

      report: function () {
        var report = null;
        if (this._defaultSession !== null) {
          report = this._defaultSession.report();
        }
        return report;
      },

      run: function (testName) {
        var result = null;
        if (this._defaultSession !== null) {
          result = this._defaultSession.run(testName);
        }
        return result;
      }

    });

});