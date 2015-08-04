script({name: 'lib.jsz.log'}, function () {
  'use strict';

  // The log-object to hold the log-functions.
  window.log = {};

  // The jsz.log.module
  namespace('jsz').module('log').def({

    // Names of functions who are usually supported by the console and a little
    // more.
    expectedFunctions: [
      'log', 'debug', 'info', 'warn', 'exception', 'assert', 'dir', 'dirxml',
      'trace', 'group', 'groupCollapsed', 'groupEnd', 'profile', 'profileEnd',
      'count', 'clear', 'time', 'timeEnd', 'timeStamp', 'table', 'error',
      'success'
    ],

    // Function names for the stack logger
    stackFunctions: ['debug', 'info', 'warn', 'error', 'success'],

    /** @member {jsz.HTMLElement} */
    htmlElement: jsz.HTMLElement.empty,

    create: function (type) {
      if (window.console === undefined) {
        type = 'noop';
      }

      if (type === undefined) {
        type = _jsz_.log.type;
      }

      switch (type) {
        case 'console':
          this._createLogConsole();
          break;
        case 'stack':
          this._createLogStack();
          break;
        case 'noop':
          this._createLogNoop();
          break;
        default:
          throw new Error('Can not create log of type ' + _jsz_.log.type + '!');
      }
    },


    _createLogConsole: function () {
      window.log = console;
      this.expectedFunctions.forEach(function (functionName) {
        if (window.console[functionName] === undefined) {
          window.log[functionName] = noop;
        }
      });
    },

    _createLogStack: function () {
      // TODO: Experiment: log with error.stack
      // log.type.stack is just an experiment for now.
      // console.warn('log.type.stack is just an experiment for now.');
      window.log = {};
      // The omitted function will be used to write on the console.
      var omittedFunction = 'log';
      this.expectedFunctions.forEach(function (functionName) {
        if (this.stackFunctions.contains(functionName)) {
          window.log[functionName] = jsz.log._logStack(functionName);
        }
        else if (window.console[functionName] === undefined) {
          window.log[functionName] = noop;
        }
        else if (functionName !== omittedFunction){
          window.log[functionName] = jsz.log._logConsole;
        }
      }, this);
    },

    _createLogNoop: function () {
      window.log = {};
      this.expectedFunctions.forEach(function (functionName) {
        window.log[functionName] = noop;
      });
    },

    setType: function (type) {
      try {
        jsz.log.create(type);
        _jsz_.log.type = type;
      }
      catch (err) {
        console.error(err);
        throw new Error('Can not create log of type ' + type + '!');
      }
    },

    getType: function() {
      return _jsz_.log.type;
    },

    _logStack: function (logFunctionName) {
      return function(message, showLocation) {
        showLocation = jsz.default(showLocation, true);
        var error;
        if (message instanceof Error) {
          error = new jsz.Error(message);
        }
        else if (message instanceof jsz.Error) {
          error = message;
        }
        else {
          error = new jsz.Error(message, 1);
        }


        var location = error.fileName + ':' +
          error.lineNumber + ':' +
          logFunctionName + ':';

        if ( jsz.log.htmlElement.isEmpty()) {
          if (showLocation) {
            console.log(location + JSZ.BLANK + error.message);
          }
          else {
            console.log(error.message);
          }
        }
        else {
          var row = jsz.HTMLElement.make(
            'div', {class:[logFunctionName]});
          if (showLocation) {
            row.append(
              jsz.HTMLElement.make('span', {class:'location'}, location));
          }
          row.append(
            jsz.HTMLElement.make('span', {class:'message'}, error.message));
          jsz.log.htmlElement.append( row);
        }
      };
    },

    _logConsole: function(logFunctionName) {
      return function() {
        console.apply( logFunctionName, arguments);
      };
    },

    /**
     * Set the html-element to append logs.
     * @param {jsz.HTMLElement} [htmlElement]
     */
    setLogTo: function(htmlElement) {
      if (htmlElement === undefined) {
        jsz.log.htmlElement = jsz.HTMLElement.empty;
      }
      else {
        jsz.log.htmlElement = htmlElement;
      }
    }

  });

  jsz.log.create();

});
