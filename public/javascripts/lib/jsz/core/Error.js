script({
  name: 'lib.jsz.core.Error',
  require: [
    'lib.jsz.core.Namespace',
    'lib.jsz.core.Object'
  ]
}, function() {
  'use strict';

  namespace('jsz').class( 'Error').def({

    Error: function(value, skip, causedBy) {
      if (skip === undefined) {
        skip = 0;
        causedBy = null;
      }
      else if (jsz.isError(skip)) {
        causedBy = skip;
        skip = 0;
      }

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

      if ( value instanceof Error) {
        var error = value;

        this.message = error.message;
        this.name = error.name;
        this._setStack(this._getStack(error), false, skip);
      }
      else {
        var message = value;
        if (message === undefined) {
          message = JSZ.EMPTY_STRING;
        }

        this.message = message;
        this.name = this._jsz_.className;
        this._setStack(
          this._getStack(new Error(), true, skip)
        );
      }
    },

    _setStack: function( stack) {
      this.stack = stack;
      var stackFrame = this.stack[0];
      this.protocol = stackFrame.protocol;
      this.host = stackFrame.host;
      this.port = stackFrame.port;
      this.path = stackFrame.path;
      this.fileName = stackFrame.fileName;
      this.lineNumber = stackFrame.lineNumber;
      this.colNumber = stackFrame.colNumber;
    },

    _getStack: function( error, jszError, skip) {
      var stack =  error
        .stack
        .split(JSZ.NEW_LINE)
        .map(this._parseStackEntry);
      return this._skip(stack, jszError, skip);
    },

    _skip: function(stack, jszError, skip) {
      if (jszError) {
        while(stack.length > 0 && stack[0].functionName !== this.name) {
          stack.shift();
        }
        if (stack.length > 2) {
          stack = stack.slice(2);
        }
      }

      if ( skip > 0 && skip < stack.length) {
        stack = stack.slice(skip);
      }

      return stack;
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

    toString: function() {
      return this.name + ':' +
        this.fileName + ':' +
        this.lineNumber + ':' +
        this.message;
    }

  });

});
