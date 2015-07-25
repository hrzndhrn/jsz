script({name: 'lib.jsz.log'}, function () {
  'use strict';

  // The log-object to hold the log-functions.
  window.log = {};

  // The jsz.log.module
  namespace('jsz').module('log').def({

    // Names of functions who are usually supported by the console.
    expectedFunctions: [
      'log', 'debug', 'info', 'warn', 'exception', 'assert', 'dir', 'dirxml',
      'trace', 'group', 'groupCollapsed', 'groupEnd', 'profile', 'profileEnd',
      'count', 'clear', 'time', 'timeEnd', 'timeStamp', 'table', 'error'
    ],

    // Function names for the stack logger
    stackFunctions: ['debug', 'info', 'warn'],

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
      console.warn('log.type.stack is just an experiment for now.');
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

    _logStack: function (logFunctionName) {
      return function() {
        var args = Array.fromArguments(arguments);
        var stack = jsz.log.getStack(1)[0];

        var msg = stack.fileName + ':' +
          stack.lineNumber + ':' +
          logFunctionName + ': ' +
          args.join(', ');

        if ( jsz.log.htmlElement.isEmpty()) {
          console.log(msg);
        }
        else {
          jsz.log.htmlElement.append(
            jsz.HTMLElement.make('div', {class:['log',logFunctionName]}, msg));
        }
      };
    },

    _logConsole: function(logFunctionName) {
      return function() {
        console.apply( logFunctionName, arguments);
      };
    },

    getErrorStack: function( error, skip) {
      return error
        .stack
        .split(JSZ.NEW_LINE)
        .slice(skip === undefined ? 1 : skip + 1)
        .map(this._parseStackEntry);
    },

    getStack: function(skip) {
      return this.getErrorStack( new Error(), skip);
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
    },

    _parseStackEntry: function(entry) {
      var entryObject = {}, codePointer;

      // Get the function name and the code pointer
      var funAtPos = (/^(.*)@(.*)$/).exec(entry);
      if (funAtPos === null) {
        // this entry holds just a code pointer
        entryObject.functionName = JSZ.EMPTY_STRING;
        codePointer = entry;
      }
      else {
        entryObject.functionName = funAtPos[1];
        codePointer = funAtPos[2];
      }

      // Split code pointer. The code pointer has usually the format:
      // protocol://host:port/path/fileName:lineNumber:colNumber
      //     |        |   |    |      |         |         |
      //     |        |   |    |      |         |         +-----------+---+
      //     |        |   |    |      |         +---------------+---+ |   |
      //     |        |   |    |      +--------------------+--+ |   | |   |
      //     |        |   |    +---------------------+----+|  | |   | |   |
      //     |        |   +---------------------+---+|    ||  | |   | |   |
      //     |        +-----------------+-----+ |   ||    ||  | |   | |   |
      //     +-----------------+--+     |     | |   ||    ||  | |   | |   |
      //                       |  |     |     | |   ||    ||  | |   | |   |
      var codePointerParts = (/(.*):\/\/([^:]*):(\d*)(.*)\/(.*):(\d*):(\d*)/)
        .exec(codePointer);

      if ( codePointerParts === null) {
        entryObject.fileName = codePointer;
      }
      else {
        entryObject.codePointer = codePointerParts[0];
        entryObject.protocl = codePointerParts[1];
        entryObject.host = codePointerParts[2];
        entryObject.port = codePointerParts[3];
        entryObject.path = codePointerParts[4];
        entryObject.fileName = codePointerParts[5];
        entryObject.lineNumber = codePointerParts[6];
        entryObject.colNumber = codePointerParts[7];
      }

      return entryObject;
    }

  });

  jsz.log.create();

});
