script({name: 'lib.jsz.core.Date'}, function () {
  'use strict';

  /**
   * Milliseconds in one second (1000) (ISO).
   * @constant
   * @type {Integer}
   */
  Date.MILLIS_PER_SECOND = 1000;

  Date.prototype.equals = function(date) {
    console.log('Date.equals: ' + this.getTime() + ' = ' + date.getTime());
    console.log(this.getTime() === date.getTime());
    return this.getTime() === date.getTime();
  };

});

