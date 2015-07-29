script({
  name: 'lib.jsz.unit.assert'
}, function() {
  'use strict';

  console.log('eval jsz.unit.assert');

  namespace('jsz.unit').module( 'assert').def({

    equals: function( objA, objB, msg) {
      if ( typeof msg === 'undefined' ) {
        msg = JSZ.EMPTY_STRING;
      }

      if ( objA !== objB ) {
        throw new jsz.unit.AssertError(
          'Not equal! ' + msg + '\n' +
          'get     : >' + objA + '<\n' +
          'expected: >' + objB + '<', 1);
      }
    },

    equalsIgnoreCase: function( strA, strB, msg) {
      if ( typeof msg === 'undefined' ) {
        msg = '';
      }

      if ( !jsz.isString(strA) || !jsz.isString(strB) ||
        !strA.equalsIgnoreCase(strA)) {
        throw new jsz.unit.AssertError(
          'Not equal! ' + msg + '\n' +
          'get     : >' + strA + '<\n' +
          'expected: >' + strB + '<'
        );
      }
    },

    isTrue: function(obj, msg) {
      msg = jsz.default(msg, JSZ.EMPTY_STRING);

      if ( obj !== true ) {
        throw new jsz.unit.AssertError(
          'Not true! ' + msg + '\nget: >' + obj + '<'
        );
      }
    },

    isFalse: function(obj, msg) {
      msg = jsz.default(msg, JSZ.EMPTY_STRING);

      if ( obj !== false ) {
        throw new jsz.unit.AssertError(
          'Not false! ' + msg + '\nget: >' + obj + '<'
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

    isUndefined: function( a, msg) {
      if ( typeof msg === 'undefined' ) msg = '';
      if ( typeof a !== 'undefined' ) {
        var e = new Error( 'Not undefined! ' + msg + '\nget: >' + a + '<');
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

    _isArray: function(value) {
      return value && Object.prototype.toString.apply(value) === JSX.ARRAY_TO_STRING;
    },

    isFunction: function( func, message) {
      if ( typeof message === 'undefined') message = JSX.EMPTY_STRING;

      if ( !jsx.type.isFunction(func)) {
        if ( message === JSX.EMPTY_STRING) message = 'Is not a function! [' + typeof func + ']';
        var e = new Error( message);
        e.type = 'Assert';
        throw e;
      }
    },

    isNoFunction: function( func, message) {
      if ( typeof message === 'undefined') message = JSX.EMPTY_STRING;

      if ( jsx.type.isFunction(func)) {
        if ( message === JSX.EMPTY_STRING) message = 'Is a function! [' + typeof func + ']';
        var e = new Error( message);
        e.type = 'Assert';
        throw e;
      }
    },

    isInstanceOf: function( instance, aClass) {
      if ( typeof message === 'undefined') message = JSX.EMPTY_STRING;

      if ( !jsx.type.isInstanceOf(instance, aClass)) {
        if ( message === JSX.EMPTY_STRING) message = 'Is not an instance of ' + aClass;
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