script({
  name: 'test.jsz.util.timerTask',
  require: [
    'lib.jsz.util.TimerTask',
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.util').add(
    new jsz.unit.TestCase({
      name: 'TimerTask:delay',
      setup: function(testCase) {
        this.testCaseName = testCase.name;
        log.debug('setup test case ' + this.testCaseName);

        this.assert = jsz.unit.assert;
        this.tolerance = Date.MILLIS_PER_SECOND / 10;
        this.timeSpan = Date.MILLIS_PER_SECOND;
        this.timerTask = new jsz.util.TimerTask({
          delay: this.timeSpan,
          callback: testCase.callback('callback')
        });
      },
      tests: [
        {name:'start'},
        {name:'callback'}
      ],
      methods: {
        start: function() {
          log.debug(this.testCaseName + ' - start');

          this.startTimestamp = Date.now();
          this.timerTask.start();
        },

        callback: function() {
          log.debug(this.testCaseName + ' - calllback');

          this.applyTimestamp = Date.now();
          var timeSpan = this.applyTimestamp - this.startTimestamp;
          this.assert.isTrue(
            Math.abs(timeSpan - this.timeSpan) < this.tolerance);
        }
      }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'TimerTask:interval',
      setup: function(testCase) {
        this.testCaseName = testCase.name;
        log.debug('setup test case ' + this.testCaseName);

        this.assert = jsz.unit.assert;

        this.tolerance = Date.MILLIS_PER_SECOND / 10;
        this.timeSpan = Date.MILLIS_PER_SECOND;
        this.callback = testCase.callback('callback');
        this.callbackCount = 1;
        this.times = 3;

        this.callbackInterval = unite( function() {
          log.debug(this.testCaseName + ' - calllbackInterval');

          if (this.callbackCount < this.times) {
            this.callbackCount++;
          }
          else {
            this.callback();
          }
        }, this);

        this.timerTask = new jsz.util.TimerTask({
          interval: this.timeSpan,
          callback: this.callbackInterval
        });
      },
      tests: [
        {name:'start'},
        {name:'callback'}
      ],
      methods: {
        start: function() {
          log.debug(this.testCaseName + ' - start');

          this.startTimestamp = Date.now();
          this.timerTask.start();
        },

        callback: function() {
          log.debug(this.testCaseName + ' - calllback');

          this.timerTask.stop();
          this.applyTimestamp = Date.now();
          var timeSpan = this.applyTimestamp - this.startTimestamp;
          this.assert.isTrue(
            Math.abs(timeSpan - (this.times * this.timeSpan)) < this.tolerance);
        }
      }
    })
  ).add(
    new jsz.unit.TestCase({
      name: 'TimerTask:withParams',
      setup: function(testCase) {
        this.testCaseName = testCase.name;
        this.callback = testCase.callback('callback');
        this.assert = jsz.unit.assert;

        this.obj = {
          a: 0,
          b: 0
        }

        this.timerTaskCallback = function(a,b) {
          this.obj.a = a;
          this.obj.b = b;
          this.callback();
        }

        this.timerTask = new jsz.util.TimerTask({
          delay: jsz.time.second().millis(),
          callback: this.timerTaskCallback,
          scope: this,
          params: [1,2]
        });
      },
      tests: [
        {name:'start'},
        {name:'callback'}
      ],
      methods: {
        start: function() {
          log.debug(this.testCaseName + ' - start');
          this.timerTask.start();
        },

        callback: function() {
          log.debug(this.testCaseName + ' - calllback');
          log.dir({obj:this.obj});

          this.assert.isEqual(this.obj.a,1);
          this.assert.isEqual(this.obj.b,2);
        }
      }
    })
  );

});
