script({
  name: 'test.jsz.core.isType',
  require: [
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.core').add(
    new jsz.unit.TestCase({
      name: 'isType',
      setup: function () {
        this.assert = jsz.unit.assert;
        this.isFalse = this.assert.isFalse;
        this.isTrue = this.assert.isTrue;

        this.anError = new Error('error');
        this.jszError = new jsz.Error('error');
        this.str = 'str';
        this.args = (function() {return arguments;})(1,2,3);
        this.fun = function() {};
        this.regExp = new RegExp();
        this.obj = {};
        this.num = 0;
        this.float = 0.4;
        this.bool = false;
        this.date = new Date();
        this.array = [];
      },
      methods: {

        isError: function () {
          this.isTrue(jsz.isError(this.anError), 
            'jsz.isError(this.anError)');
          this.isTrue(jsz.isError(this.jszError), 
            'jsz.isError(this.jszError)');
          this.isFalse(jsz.isError(this.str),
            'jsz.isError(this.str)');
          this.isFalse(jsz.isError(this.args),
            'jsz.isError(this.args)');
          this.isFalse(jsz.isError(this.fun),
            'jsz.isError(this.fun)');
          this.isFalse(jsz.isError(this.regExp),
            'jsz.isError(this.regExp)');
          this.isFalse(jsz.isError(this.obj),
            'jsz.isError(this.obj)');
          this.isFalse(jsz.isError(this.num),
            'jsz.isError(this.num)');
          this.isFalse(jsz.isError(this.float),
            'jsz.isError(this.float)');
          this.isFalse(jsz.isError(this.bool),
            'jsz.isError(this.bool)');
          this.isFalse(jsz.isError(this.date),
            'jsz.isError(this.date)');
          this.isFalse(jsz.isError(this.array),
            'jsz.isError(this.array)');
        },

        isFunction: function () {
          this.isFalse(jsz.isFunction(this.anError),
            'jsz.isFunction(this.anError)');
          this.isFalse(jsz.isFunction(this.jszError),
            'jsz.isFunction(this.jszError)');
          this.isFalse(jsz.isFunction(this.str),
            'jsz.isFunction(this.str)');
          this.isFalse(jsz.isFunction(this.args),
            'jsz.isFunction(this.args)');
          this.isTrue(jsz.isFunction(this.fun),
            'jsz.isFunction(this.fun)');
          this.isFalse(jsz.isFunction(this.regExp),
            'jsz.isFunction(this.regExp)');
          this.isFalse(jsz.isFunction(this.obj),
            'jsz.isFunction(this.obj)');
          this.isFalse(jsz.isFunction(this.num),
            'jsz.isFunction(this.num)');
          this.isFalse(jsz.isFunction(this.float),
            'jsz.isFunction(this.float)');
          this.isFalse(jsz.isFunction(this.bool),
            'jsz.isFunction(this.bool)');
          this.isFalse(jsz.isFunction(this.date),
            'jsz.isFunction(this.date)');
          this.isFalse(jsz.isFunction(this.array),
            'jsz.isFunction(this.array)');
        },

        isRegExp: function () {
          this.isFalse(jsz.isRegExp(this.anError),
            'jsz.isRegExp(this.anError)');
          this.isFalse(jsz.isRegExp(this.jszError),
            'jsz.isRegExp(this.jszError)');
          this.isFalse(jsz.isRegExp(this.str),
            'jsz.isRegExp(this.str)');
          this.isFalse(jsz.isRegExp(this.args),
            'jsz.isRegExp(this.args)');
          this.isFalse(jsz.isRegExp(this.fun),
            'jsz.isRegExp(this.fun)');
          this.isTrue(jsz.isRegExp(this.regExp),
            'jsz.isRegExp(this.regExp)');
          this.isFalse(jsz.isRegExp(this.obj),
            'jsz.isRegExp(this.obj)');
          this.isFalse(jsz.isRegExp(this.num),
            'jsz.isRegExp(this.num)');
          this.isFalse(jsz.isRegExp(this.float),
            'jsz.isRegExp(this.float)');
          this.isFalse(jsz.isRegExp(this.bool),
            'jsz.isRegExp(this.bool)');
          this.isFalse(jsz.isRegExp(this.date),
            'jsz.isRegExp(this.date)');
          this.isFalse(jsz.isRegExp(this.array),
            'jsz.isRegExp(this.array)');
        },

        isArguments: function () {
          this.isFalse(jsz.isArguments(this.anError),
            'jsz.isArguments(this.anError)');
          this.isFalse(jsz.isArguments(this.jszError),
            'jsz.isArguments(this.jszError)');
          this.isFalse(jsz.isArguments(this.str),
            'jsz.isArguments(this.str)');
          this.isTrue(jsz.isArguments(this.args),
            'jsz.isArguments(this.args)');
          this.isFalse(jsz.isArguments(this.fun),
            'jsz.isArguments(this.fun)');
          this.isFalse(jsz.isArguments(this.regExp),
            'jsz.isArguments(this.regExp)');
          this.isFalse(jsz.isArguments(this.obj),
            'jsz.isArguments(this.obj)');
          this.isFalse(jsz.isArguments(this.num),
            'jsz.isArguments(this.num)');
          this.isFalse(jsz.isArguments(this.float),
            'jsz.isArguments(this.float)');
          this.isFalse(jsz.isArguments(this.bool),
            'jsz.isArguments(this.bool)');
          this.isFalse(jsz.isArguments(this.date),
            'jsz.isArguments(this.date)');
          this.isFalse(jsz.isArguments(this.array),
            'jsz.isArguments(this.array)');
        },

        isArray: function () {
          this.isFalse(jsz.isArray(this.anError),
            'jsz.isArray(this.anError)');
          this.isFalse(jsz.isArray(this.jszError),
            'jsz.isArray(this.jszError)');
          this.isFalse(jsz.isArray(this.str),
            'jsz.isArray(this.str)');
          this.isFalse(jsz.isArray(this.args),
            'jsz.isArray(this.args)');
          this.isFalse(jsz.isArray(this.fun),
            'jsz.isArray(this.fun)');
          this.isFalse(jsz.isArray(this.regExp),
            'jsz.isArray(this.regExp)');
          this.isFalse(jsz.isArray(this.obj),
            'jsz.isArray(this.obj)');
          this.isFalse(jsz.isArray(this.num),
            'jsz.isArray(this.num)');
          this.isFalse(jsz.isArray(this.float),
            'jsz.isArray(this.float)');
          this.isFalse(jsz.isArray(this.bool),
            'jsz.isArray(this.bool)');
          this.isFalse(jsz.isArray(this.date),
            'jsz.isArray(this.date)');
          this.isTrue(jsz.isArray(this.array),
            'jsz.isArray(this.array)');
        },

        isObject: function () {
          this.isTrue(jsz.isObject(this.anError),
            'jsz.isObject(this.anError)');
          this.isTrue(jsz.isObject(this.jszError),
            'jsz.isObject(this.jszError)');
          this.isFalse(jsz.isObject(this.str),
            'jsz.isObject(this.str)');
          this.isTrue(jsz.isObject(this.args),
            'jsz.isObject(this.args)');
          this.isFalse(jsz.isObject(this.fun),
            'jsz.isObject(this.fun)');
          this.isTrue(jsz.isObject(this.regExp),
            'jsz.isObject(this.regExp)');
          this.isTrue(jsz.isObject(this.obj),
            'jsz.isObject(this.obj)');
          this.isFalse(jsz.isObject(this.num),
            'jsz.isObject(this.num)');
          this.isFalse(jsz.isObject(this.float),
            'jsz.isObject(this.float)');
          this.isFalse(jsz.isObject(this.bool),
            'jsz.isObject(this.bool)');
          this.isTrue(jsz.isObject(this.date),
            'jsz.isObject(this.date)');
          this.isFalse(jsz.isObject(this.array),
            'jsz.isObject(this.array)');
        },

        isPlainObject: function () {
          this.isFalse(jsz.isPlainObject(window),
            'jsz.isPlainObject(window)');
          this.isFalse(jsz.isPlainObject(this.anError),
            'jsz.isPlainObject(this.anError)');
          this.isFalse(jsz.isPlainObject(this.jszError),
            'jsz.isPlainObject(this.jszError)');
          this.isFalse(jsz.isPlainObject(this.str),
            'jsz.isPlainObject(this.str)');
          this.isFalse(jsz.isPlainObject(this.args),
            'jsz.isPlainObject(this.args)');
          this.isFalse(jsz.isPlainObject(this.fun),
            'jsz.isPlainObject(this.fun)');
          this.isFalse(jsz.isPlainObject(this.regExp),
            'jsz.isPlainObject(this.regExp)');
          this.isTrue(jsz.isPlainObject(this.obj),
            'jsz.isPlainObject(this.obj)');
          this.isFalse(jsz.isPlainObject(this.num),
            'jsz.isPlainObject(this.num)');
          this.isFalse(jsz.isPlainObject(this.float),
            'jsz.isPlainObject(this.float)');
          this.isFalse(jsz.isPlainObject(this.bool),
            'jsz.isPlainObject(this.bool)');
          this.isFalse(jsz.isPlainObject(this.date),
            'jsz.isPlainObject(this.date)');
          this.isFalse(jsz.isPlainObject(this.array),
            'jsz.isObject(this.array)');
        },

        isNumber: function () {
          this.isFalse(jsz.isNumber(this.anError),
            'jsz.isNumber(this.anError)');
          this.isFalse(jsz.isNumber(this.jszError),
            'jsz.isNumber(this.jszError)');
          this.isFalse(jsz.isNumber(this.str),
            'jsz.isNumber(this.str)');
          this.isFalse(jsz.isNumber(this.args),
            'jsz.isNumber(this.args)');
          this.isFalse(jsz.isNumber(this.fun),
            'jsz.isNumber(this.fun)');
          this.isFalse(jsz.isNumber(this.regExp),
            'jsz.isNumber(this.regExp)');
          this.isFalse(jsz.isNumber(this.obj),
            'jsz.isNumber(this.obj)');
          this.isTrue(jsz.isNumber(this.num),
            'jsz.isNumber(this.num)');
          this.isTrue(jsz.isNumber(this.float),
            'jsz.isNumber(this.float)');
          this.isFalse(jsz.isNumber(this.bool),
            'jsz.isNumber(this.bool)');
          this.isFalse(jsz.isNumber(this.date),
            'jsz.isNumber(this.date)');
          this.isFalse(jsz.isNumber(this.array),
            'jsz.isNumber(this.array)');
        },

        isBoolean: function () {
          this.isFalse(jsz.isBoolean(this.anError),
            'jsz.isBoolean(this.anError)');
          this.isFalse(jsz.isBoolean(this.jszError),
            'jsz.isBoolean(this.jszError)');
          this.isFalse(jsz.isBoolean(this.str),
            'jsz.isBoolean(this.str)');
          this.isFalse(jsz.isBoolean(this.args),
            'jsz.isBoolean(this.args)');
          this.isFalse(jsz.isBoolean(this.fun),
            'jsz.isBoolean(this.fun)');
          this.isFalse(jsz.isBoolean(this.regExp),
            'jsz.isBoolean(this.regExp)');
          this.isFalse(jsz.isBoolean(this.obj),
            'jsz.isBoolean(this.obj)');
          this.isFalse(jsz.isBoolean(this.num),
            'jsz.isBoolean(this.num)');
          this.isFalse(jsz.isBoolean(this.float),
            'jsz.isBoolean(this.float)');
          this.isTrue(jsz.isBoolean(this.bool),
            'jsz.isBoolean(this.bool)');
          this.isFalse(jsz.isBoolean(this.date),
            'jsz.isBoolean(this.date)');
          this.isFalse(jsz.isBoolean(this.array),
            'jsz.isBoolean(this.array)');
        },

        isString: function () {
          this.isFalse(jsz.isString(this.anError),
            'jsz.isString(this.anError)');
          this.isFalse(jsz.isString(this.jszError),
            'jsz.isString(this.jszError)');
          this.isTrue(jsz.isString(this.str),
            'jsz.isString(this.str)');
          this.isFalse(jsz.isString(this.args),
            'jsz.isString(this.args)');
          this.isFalse(jsz.isString(this.fun),
            'jsz.isString(this.fun)');
          this.isFalse(jsz.isString(this.regExp),
            'jsz.isString(this.regExp)');
          this.isFalse(jsz.isString(this.obj),
            'jsz.isString(this.obj)');
          this.isFalse(jsz.isString(this.num),
            'jsz.isString(this.num)');
          this.isFalse(jsz.isString(this.float),
            'jsz.isString(this.float)');
          this.isFalse(jsz.isString(this.bool),
            'jsz.isString(this.bool)');
          this.isFalse(jsz.isString(this.date),
            'jsz.isString(this.date)');
          this.isFalse(jsz.isString(this.array),
            'jsz.isString(this.array)');
        },

        isInt: function () {
          this.isFalse(jsz.isInt(this.anError),
            'jsz.isInt(this.anError)');
          this.isFalse(jsz.isInt(this.jszError),
            'jsz.isInt(this.jszError)');
          this.isFalse(jsz.isInt(this.str),
            'jsz.isInt(this.str)');
          this.isFalse(jsz.isInt(this.args),
            'jsz.isInt(this.args)');
          this.isFalse(jsz.isInt(this.fun),
            'jsz.isInt(this.fun)');
          this.isFalse(jsz.isInt(this.regExp),
            'jsz.isInt(this.regExp)');
          this.isFalse(jsz.isInt(this.obj),
            'jsz.isInt(this.obj)');
          this.isTrue(jsz.isInt(this.num),
            'jsz.isInt(this.num)');
          this.isFalse(jsz.isInt(this.float),
            'jsz.isInt(this.float)');
          this.isFalse(jsz.isInt(this.bool),
            'jsz.isInt(this.bool)');
          this.isFalse(jsz.isInt(this.date),
            'jsz.isInt(this.date)');
          this.isFalse(jsz.isInt(this.array),
            'jsz.isInt(this.array)');
        },

        isDate: function () {
          this.isFalse(jsz.isDate(this.anError),
            'jsz.isDate(this.anError)');
          this.isFalse(jsz.isDate(this.jszError),
            'jsz.isDate(this.jszError)');
          this.isFalse(jsz.isDate(this.str),
            'jsz.isDate(this.str)');
          this.isFalse(jsz.isDate(this.args),
            'jsz.isDate(this.args)');
          this.isFalse(jsz.isDate(this.fun),
            'jsz.isDate(this.fun)');
          this.isFalse(jsz.isDate(this.regExp),
            'jsz.isDate(this.regExp)');
          this.isFalse(jsz.isDate(this.obj),
            'jsz.isDate(this.obj)');
          this.isFalse(jsz.isDate(this.num),
            'jsz.isDate(this.num)');
          this.isFalse(jsz.isDate(this.float),
            'jsz.isDate(this.float)');
          this.isFalse(jsz.isDate(this.bool),
            'jsz.isDate(this.bool)');
          this.isTrue(jsz.isDate(this.date),
            'jsz.isDate(this.date)');
          this.isFalse(jsz.isDate(this.array),
            'jsz.isDate(this.array)');
        },

        end: function () {
        }

      }
    })
  );

});
