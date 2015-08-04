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

  });
});