script({
  name: 'lib.jsz.unit.assert'
}, function() {
  'use strict';

  namespace('jsz.unit').module( 'assert').def({

    SKIP_STACK_FRAMES: 1,

    isEqual: function( objectGet, objectExpected, message) {
      if ( typeof message === 'undefined' ) {
        message = JSZ.EMPTY_STRING;
      }

      if ( objectGet !== objectExpected ) {
        throw new jsz.unit.AssertError(
          'Not equal! ' + message + '\n' +
          'get     : >' + objectGet + '<\n' +
          'expected: >' + objectExpected + '<', 1);
      }
    },

    isEqualIgnoreCase: function( stringGet, stringExpected, message) {
      if ( typeof message === 'undefined' ) {
        message = '';
      }

      if ( !jsz.isString(stringGet) || !jsz.isString(stringExpected) ||
        !stringGet.equalsIgnoreCase(stringGet)) {
        throw new jsz.unit.AssertError(
          'Not equal! ' + message + '\n' +
          'get     : >' + stringGet + '<\n' +
          'expected: >' + stringExpected + '<'
        );
      }
    },

    isTrue: function(object, message) {
      message = jsz.default(message, JSZ.EMPTY_STRING);

      if ( object !== true ) {
        throw new jsz.unit.AssertError(
          'Not true! ' + message + '\nget: >' + object + '<',
          this.SKIP_STACK_FRAMES
        );
      }
    },

    isFalse: function(object, message) {
      message = jsz.default(message, JSZ.EMPTY_STRING);

      if ( object !== false ) {
        throw new jsz.unit.AssertError(
          'Not false! ' + message + '\nget: >' + object + '<',
          this.SKIP_STACK_FRAMES
        );
      }
    },

    isEqualArray: function(arrayGet, arrayExpected, message) {
      message = jsz.default(message, JSZ.EMPTY_STRING);

      if (!jsz.isArray(arrayGet)) {
        throw new jsz.unit.AssertError(
          'The first argument is not an array! ' + message,
          this.SKIP_STACK_FRAMES
        );
      }

      if (!jsz.isArray(arrayExpected)) {
        throw new jsz.unit.AssertError(
          'The second argument is not an array! ' + message,
          this.SKIP_STACK_FRAMES
        );
      }

      if (arrayGet.length !== arrayExpected.length) {
        throw new jsz.unit.AssertError(
          'The arrays have not the same length! ' + message +'\n' +
          'get     : >' + arrayGet.length + '<\n' +
          'expected: >' + arrayExpected.length + '<',
          this.SKIP_STACK_FRAMES
        );
      }

      var index = 0, length = arrayGet.length;

      while(index < length) {
        if (arrayGet[index] !== arrayExpected[index]) {
          throw new jsz.unit.AssertError(
            'The arrays are not equal at index ' + index + '! ' +
              message + '\n' +
              'get     : >' + arrayGet[index] + '<\n' +
              'expected: >' + arrayExpected[index] + '<',
            this.SKIP_STACK_FRAMES
          );
        }
        index++;
      }
    },

    isNull: function( object, message) {
      message = jsz.default(message, JSZ.EMPTY_STRING);

      if ( object !== null ) {
        throw new jsz.unit.AssertError(
          'Not null! ' + message + '\nget: >' + object + '<',
          this.SKIP_STACK_FRAMES
        );
      }
    },

    isInstanceOf: function( object, aClass, message) {
      message = jsz.default(message, JSZ.EMPTY_STRING);

      if (aClass === undefined) {
        throw new jsz.unit.AssertError(
          'Class is undefined! ' + message, this.SKIP_STACK_FRAMES
        );
      }

      var test = object instanceof aClass;

      if (!test) {
        throw new jsz.unit.AssertError(
          'Is not an instance of ' + aClass.toString() + '! ' + message,
          this.SKIP_STACK_FRAMES
        );
      }

    },

    isUndefined: function( object, message) {
      message = jsz.default(message, JSZ.EMPTY_STRING);

      if (object !== undefined) {
        throw new jsz.unit.AssertError(
          'Not undefined! ' + message + '\nget: >' + object + '<',
          this.SKIP_STACK_FRAMES
        );
      }
    },

    isDefined: function( object, message) {
      message = jsz.default(message, JSZ.EMPTY_STRING);

      if (object === undefined) {
        throw new jsz.unit.AssertError(
          'Not defined! ' + message + '\nget: >' + object + '<',
          this.SKIP_STACK_FRAMES
        );
      }
    }





    /*
    match: function( a, regex, msg) {
      var e;

      if ( typeof msg === 'undefined' ) msg = '';

      if ( !regex.test ) {
        e = new Error( 'Second paremeter must be a RegEx! ' + msg + '\n');
        e.type = 'Assert';
        throw e;
      }


      if ( !regex.test(a) ) {
        e = new Error( 'Not match! ' + msg + '\n'
        + 'get     : >' + a + '<\n'
        + 'expected: >' + regex + '<');
        e.type = 'Assert';
        throw e;
      }
    },

    isNull: function( a, msg) {
      if ( typeof msg === 'undefined' ) msg = '';
      if ( a !== null ) {
        var e = new Error( 'Not null! ' + msg + '\nget: >' + a + '<');
        e.type = 'Assert';
        throw e;
      }
    },


    isDefined: function( a, msg) {
      if ( typeof msg === 'undefined' ) msg = '';
      if ( typeof a === 'undefined' ) {
        var e = new Error( 'Not defined! ' + msg + '\nget: >' + a + '<');
        e.type = 'Assert';
        throw e;
      }
    },


    isEmptyArray: function( array, message) {
      var e;

      if ( typeof message === 'undefined') message = JSX.EMPTY_STRING;

      if ( !this._isArray(array)) {
        e = new Error( 'Is not an array!');
        e.type = 'Assert';
        throw e;
      }

      if ( array.length > 0) {
        if ( message === JSX.EMPTY_STRING) message = 'Array is not empty!';
        e = new Error( message);
        e.type = 'Assert';
        throw e;
      }
    },


    isFunction: function( func, message) {
      if ( typeof message === 'undefined') message = JSX.EMPTY_STRING;

      if ( !jsx.type.isFunction(func)) {
        if ( message === JSX.EMPTY_STRING) {
          message = 'Is not a function! [' + typeof func + ']';
        }
        var e = new Error( message);
        e.type = 'Assert';
        throw e;
      }
    },

    isNoFunction: function( func, message) {
      if ( typeof message === 'undefined') message = JSX.EMPTY_STRING;

      if ( jsx.type.isFunction(func)) {
        if ( message === JSX.EMPTY_STRING) {
          message = 'Is a function! [' + typeof func + ']';
        }
        var e = new Error( message);
        e.type = 'Assert';
        throw e;
      }
    },

    isInstanceOf: function( instance, aClass) {
      if ( typeof message === 'undefined') message = JSX.EMPTY_STRING;

      if ( !jsx.type.isInstanceOf(instance, aClass)) {
        if ( message === JSX.EMPTY_STRING) {
          message = 'Is not an instance of ' + aClass;
        }
        var e = new Error( message);
        e.type = 'Assert';
        throw e;
      }
    },

    likeBool: function( a, b, msg) {
      var e;
      if ( typeof msg === 'undefined' ) msg = '';
      if ( a ) {
        if ( !b ) {
          e = new Error( 'Not like false! ' + msg + '\nget: >' + a + '<');
          e.type = 'Assert';
          throw e;
        }
      } else {
        if ( b ) {
          e = new Error( 'Not like true! ' + msg + '\nget: >' + a + '<');
          e.type = 'Assert';
          throw e;
        }
      }
    },

    length: function( a, length, msg) {
      var e;
      if ( a === null ) {
        e = new Error( 'Null!');
        e.type = 'Assert';
        throw e;
      }
      if ( typeof a.length === 'undefined') {
        e = new Error( 'Not function length found!');
        e.type = 'Assert';
        throw e;
      }
      if ( a.length !== length ) {
        e = new Error( 'No valid length!\n'
        + 'get     : ' + a.length + '\n'
        + 'expected: ' + length );
        e.type = 'Assert';
        throw e;
      }
    },

    fail: function( msg) {
      if ( msg === undefined) msg = '';
      error = new Error( 'Fail! ' + msg);
      error.type = 'Assert';
      throw error;
    },

    failed: function( func, scope, args, errorMessage) {
      args = jsx.type.isArray( args) ? args : [args];

      var failed = false;

      try {
        func.apply( scope, args);
      }
      catch( error) {
        failed = true;
        if ( jsx.type.isDefined( errorMessage)) {
          if ( error.message !== errorMessage) {
            e = new Error("Wrong error: " + error.message)
            e.type = 'Assert';
            throw e;
          }
        }
      }

      if ( !failed) {
        e = new Error("Do not failed!")
        e.type = 'Assert';
        throw e;
      }
    },

    success: function() {}
    */

  });
});