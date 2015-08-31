script({name: 'lib.jsz.util.TimerTask'}, function () {
  'use strict';

  /**
   * A class to delay a function call or call a function in an interval.
   */
  namespace('jsz.util').class('TimerTask').def({

    /**
     *
     * @param {String} [name]
     * @param {Object} config
     */
    TimerTask: function (name, config) {
      if (arguments.length === 1) {
        config = name;
        name = uniqueId('TIMER_TASK');
      }

      if (!jsz.isPlainObject(config)) {
        throw new Error('Can not find configuration for TimerTask.');
      }

      this.name = name;

      /**
       * @member {jsz.unite}
       */
      this._callback = unite(config.callback, config.scope);
      /**
       * The delay in milliseconds or -1 for inactivity.
       * @member {Integer}
       * */
      this._delay = jsz.default(config.delay, -1);
      /**
       * An interval in milliseconds or -1 for inactivity.
       * @member {Integer}
       * */
      this._interval = jsz.default(config.interval, -1);

      this._args = jsz.default(config.args, []).toArguments();

      if (this._interval > 0 && this._delay >= 0) {
        throw new Error('Just one of the two values "delay" or ' +
        '"interval " can be set.');
      }
    },

    _timeoutId: null,
    _callback: noop,
    _delay: -1,
    _interval: -1,
    _args: [],
    _startTimestamp: null,

    /**
     * Starts this timer task. The callback will be applied aber the specified
     * delay or interval.
     */
    start: function () {
      // The timer task can not be started twice and it must be active.
      if (this._timeoutId === null && this.isActive()) {
        this._timeoutId = setTimeout(this._handle(), this._getTimeSpan());
        this._startTimestamp = Date.now();
      }

      return this;
    },

    /**
     * Stops this timer task. The callback will not be applied and an interval
     * timer task stops completely.
     */
    stop: function () {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
      this._startTimestamp = null;

      return this;
    },

    /**
     * Restarts this timer task.
     */
    restart: function () {
      this.stop();
      this.start();

      return this;
    },

    /**
     * Get the time span for a delay timer task or interval timer task.
     * @returns {*}
     * @private
     */
    _getTimeSpan: function () {
      var timeSpan;

      if (this.isDelay()) {
        // For a delay timer task the time span is just the specified value.
        timeSpan = this._delay;
      }
      else {
        // For an interval timer task the time span must be calculated.
        if (this._startTimestamp) {
          // The period from the last start.
          var period = Date.now() - this._startTimestamp;
          // The lap of interval and execution time.
          var lap = period - this._interval;
          // The time span for the next interval
          timeSpan = this._interval - lap;
        }
        else {
          // If no start timestamp set then the time span is the specified
          // interval.
          timeSpan = this._interval;
        }
      }

      return timeSpan;
    },

    /**
     * Returns true if the timer task is a interval timer task.
     * @returns {boolean}
     */
    isInterval: function () {
      return this._interval >= 0;
    },

    /**
     * Returns true if the timer task is a delay timer task.
     * @returns {boolean}
     */
    isDelay: function () {
      return this._delay >= 0;
    },

    /**
     * Returns true if the timer task is active. A timer task is active if it
     * is a delay timer task or a interval timer task (isActive = isDelay ||
     * isInterval).
     *
     * @returns {boolean}
     */
    isActive: function() {
      return this.isDelay() || this.isInterval();
    },

    /**
     * Sets the delay for the timer task.
     * @param delay
     */
    setDelay: function (delay) {
      this._delay = delay;
    },

    /**
     * This method delivers a function for the window.setTimeout function.
     * @returns {Function}
     */
    _handle: function () {
      var self = this;

      return function () {
        self._apply();
      };
    },

    /**
     * This method is called by the handle and calls the callback.
     * @private
     */
    _apply: function () {
      this._callback(this._args);
      if (this.isInterval() && this._timeoutId !== null) {
        this._timeoutId = null;
        this.start();
      }
      else {
        this._timeoutId = null;
      }
    }
    
  });
  
});