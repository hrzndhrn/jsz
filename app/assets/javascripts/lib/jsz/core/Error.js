/**
 * An own Error object for jsz. The class Error used the non-standard attribute
 * stack of the built-in Error object.
 *
 * @author   Marcus Kruse
 * @version  0.1.0
 *
 */
script({
  name: 'lib.jsz.core.Error',
  require: [
    'lib.jsz.core.Namespace',
    'lib.jsz.core.Object'
  ]
}, function() {
  'use strict';

  namespace('jsz').class( 'Error').def({

    /**
     * Create a new jsz.Error. A jsz.Error object has a stack attribute of type
     * array. The stack array contains objects called stack frames.
     *
     * @member {String} filePath
     * @member {String} fileName
     * @member {String} protocol
     * @member {String} host
     * @member {String} port
     * @member {String} path
     * @member {String} fileName
     * @member {Integer} lineNumber
     * @member {Integer} colNumber
     * @member {StackFrame[]} stack
     *
     * @typedef {Object} StackFrame
     * {String} StackFrame.filePath
     * {String} StackFrame.fileName
     * {String} StackFrame.protocol
     * {String} StackFrame.host
     * {String} StackFrame.port
     * {String} StackFrame.path
     * {String} StackFrame.fileName
     * {Integer} StackFrame.lineNumber
     * {Integer} StackFrame.colNumber
     *
     * @param {Error} value - An Error object.
     * @param {String} value - The error message.
     * @param {Integer} skip [some=0] stack frames.
     * @param {Error} [causedBy=null] - An error that is the cause of this
     *   error.
     * @param {jsz.Error} [causedBy=null] - An error that is the cause of this
     *   error.
     * @constructor
     */
    Error: function(value, skip, causedBy) {
      // check argument skip
      if (skip === undefined) {
        skip = 0;
        causedBy = null;
      }
      else if (jsz.isError(skip)) {
        causedBy = skip;
        skip = 0;
      }

      // check argument causedBy
      if (causedBy === undefined) {
        this.causedBy = null;
      }
      else {
        if (causedBy instanceof Error) {
          this.causedBy = new jsz.Error(causedBy);
        }
        else {
          this.causedBy = causedBy;
        }
      }

      // check argument value
      if ( value instanceof Error) {
        // the argument value is an Error
        var error = value;

        this.message = error.message;
        this.name = error.name;

        // setup the stack
        this._setStack(
          this._getStack(error, false, skip)
        );
      }
      else {
        // the argument value is a message;
        var message = value;
        if (message === undefined) {
          message = JSZ.EMPTY_STRING;
        }

        this.message = message;
        this.name = this._jsz_.className;

        // setup the stack
        this._setStack(
          this._getStack(new Error(), true, skip)
        );
      }
    },

    /**
     * Set this.stack an copies the first frame from the stack to this error.
     * @param {StackFrame[]} stack
     */
    _setStack: function( stack) {
      this.stack = stack;
      if ( !stack.isEmpty()) {
        var stackFrame = this.stack[0];
        this.protocol = stackFrame.protocol;
        this.host = stackFrame.host;
        this.port = stackFrame.port;
        this.path = stackFrame.path;
        this.fileName = stackFrame.fileName;
        this.lineNumber = stackFrame.lineNumber;
        this.colNumber = stackFrame.colNumber;
      }
    },

    /**
     * Get an array of stack frames from the Error.stack string.
     * @param {Error} error
     * @param {Boolean} jszError
     * @param {Integer} skip
     * @returns {StackFrame[]}
     */
    _getStack: function( error, jszError, skip) {
      var stack =  error
        .stack
        .split(JSZ.NEW_LINE);

      // Opera stack starts with 'Error\n'
      if ( stack[0] === 'Error') {
        stack.shift();
      }

      return this._skip(stack.map(this._parseStackEntry), jszError, skip);
    },

    /**
     * This method skips some stack frames to point to the right position in
     * the code.
     *
     * @param {StackFrame[]} stack
     * @param {Boolean} jszError indicates if the Error a new jsz.Error
     * @param {Integer} skip holds an integer to skip some additional frames.
     * @returns {StackFrame[]}
     */
    _skip: function(stack, jszError, skip) {
      if (jszError) {
        // skip all stack frames until reaching the frame related to this
        // object.
        while(stack.length > 0 && stack[0].functionName !== this.name) {
          stack.shift();
        }
        // skip two frames more to reach the frame they is related to the point
        // where jsz.Error was created.
        if (stack.length > 2) {
          stack = stack.slice(2);
        }
      }

      // skip the number of frames that was provided by the creation of
      // jsz.Error.
      if ( skip > 0 && skip < stack.length) {
        stack = stack.slice(skip);
      }

      return stack;
    },

    /**
     * The method _parseStackEntry parsed the stack string of the built-in
     * Error and generates a StackFrame.
     *
     * @param {String} entry
     * @returns {StackFrame}
     * @private
     */
    _parseStackEntry: function(entry) {
      var entryObject = {}, codePointer, funAtPos;

      // Get the function name and the code pointer. The format of the stack
      // differs from browser to browser.
      if ( (/^\s*at\s/).test(entry)) {
        // Opera
        funAtPos = (/^\s*at\s+(.*)\s*\((.*)\)/).exec(entry);
        if (funAtPos === null) {
          funAtPos = (/^\s*at(\s+)(.*)/).exec(entry);
        }
      }
      else {
        // FireFox, Safari
        funAtPos = (/(.*)@(.*)$/).exec(entry);
      }

      if (funAtPos === null) {
        // this entry holds just a code pointer
        entryObject.functionName = JSZ.EMPTY_STRING;
        codePointer = entry;
      }
      else {
        // split the function string in a path part and a name part.
        var funPathName = (/(.*)\.(.*)/).exec(funAtPos[1]);
        if (funPathName !== null) {
          entryObject.functionPath = funPathName[1].trim();
          entryObject.functionName = funPathName[2].trim();
        }
        else {
          entryObject.functionPath = JSZ.EMPTY_STRING;
          entryObject.functionName = funAtPos[1].trim();
        }

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
        entryObject.protocol = JSZ.EMPTY_STRING;
        entryObject.host = JSZ.EMPTY_STRING;
        entryObject.port = JSZ.EMPTY_STRING;
        entryObject.path = JSZ.EMPTY_STRING;
        entryObject.fileName = JSZ.EMPTY_STRING;
        entryObject.lineNumber = JSZ.EMPTY_STRING;
        entryObject.colNumber = JSZ.EMPTY_STRING;
      }
      else {
        entryObject.codePointer = codePointerParts[0];
        entryObject.protocol = codePointerParts[1];
        entryObject.host = codePointerParts[2];
        entryObject.port = codePointerParts[3];
        entryObject.path = codePointerParts[4];
        entryObject.fileName = codePointerParts[5];
        entryObject.lineNumber = codePointerParts[6];
        entryObject.colNumber = codePointerParts[7];
      }

      return entryObject;
    },

    /**
     * The toString method returns a string representing the specified
     * jsz.Error object.
     *
     * @returns {string}
     */
    toString: function() {
      return this.name + ':' +
        this.fileName + ':' +
        this.lineNumber + ':' +
        this.message;
    }

  });

});
