script( {
    require: ['lib/jsz/core/Namespace.js']
}, function() {

module('jsz').def({

    FUNCTION_TO_STRING: '[object Function]',
    ARRAY_TO_STRING: '[object Array]',
    UNDEFINED: 0,
    DEFINED: 1,
    SET: 2,

    isError: function (o) {
        return o._type_ === 'error';

    },

    isUndefined: function (o) {
        return o === undefined;
    },

    isDefined: function (o) {
        return o !== undefined;
    },

    isNull: function (o) {
        return o === null;
    },

    isNotNull: function (o) {
        return o !== null;
    },

    isFunction: function (o) {
        return typeof o === 'function'
            || Object.prototype.toString.apply(o) === jsz.FUNCTION_TO_STRING;
    },

    isRegExp: function (o) {
        return o && typeof o === 'object' && o instanceof RegExp;
    },

    isArguments: function (obj) {
        return obj !== undefined && (obj !== null) &&
            ((Object.prototype.toString.call(obj) === '[object Arguments]') ||
            (!!obj.callee)); // fixes for ie8 non-strict-mode
    },

    isArray: Array.isArray ? function (o) {
        return Array.isArray(o);
    } : function (o) {
        return o && Object.prototype.toString.apply(o) === jsz.ARRAY_TO_STRING;
    },

    isObject: function (o) {
        if (o && typeof o === 'object' && !jsz.isArray(o)) {
            return true;
        }

        return false;
    },

    isNumber: function (o) {
        return typeof o === 'number' && isFinite(o);
    },

    isBoolean: function (o) {
        return typeof o === 'boolean';
    },

    isString: function (o) {
        return typeof o === 'string';
    },

    isInt: function (o) {
        if (jsz.isUndefined(o)) {
            return false;
        }

        return (/^-?\d+$/).test(o.toString());
    },

    isDate: function (o) {
        if (o === undefined) {
            return false;
        }

        if (o === null) {
            return false;
        }

        if (typeof o === 'object'
            && typeof o.getTime === 'function') {
            return true;
        }

        return false;
    },

    isInstanceOf: function (instance, aClass) {
        return instance instanceof aClass;
    },

    isTextNode: function (o) {
        if (o === undefined) {
            return false;
        }

        if (o === null) {
            return false;
        }

        if (o.isHTMLElementWrapper) {
            return false;
        }

        if (o.nodeType && o.nodeType === 3) {
            return true;
        }

        return false;
    },

    isElement: function (o) {
        if (o === undefined) {
            return false;
        }

        if (o === null) {
            return false;
        }

        if (o.isHTMLElementWrapper) {
            return false;
        }

        if (o.nodeType && o.nodeType === 1) {
            return true;
        }

        return false;
    },

    isHTMLElement: function (o, tagName) {
        var isElement = jsz.isElement(o);
        if (tagName === undefined) {
            return isElement;
        }

        return isElement && o.tagName.toUpperCase() === tagName.toUpperCase();
    },

    isClass: function (aClass, type) {
        // TODO: Refactroing!
        // Is aClass not defined it is also not a class.
        if (aClass === undefined) {
            return false;
        }
        // Every class needs a prototype.
        if (aClass.prototype === undefined) {
            return false;
        }
        // Look for jsx-aClass-extension. We accept only jsx-classes as a class.
        if (aClass[_jsz_.META] === undefined) {
            return false;
        }
        // Any class needs the _jsx_.extend var/flag.
        // if ( aClass.prototype._jsx_.extend === undefined ) return false;
        // At this point we have any class.
        // Test for a specific class?
        if (type === undefined) {
            return true;
        }
        // Look for a class name.
        if (aClass[_jsz_.META].className === undefined) {
            return false;
        }

        return aClass[_jsz_.META].className === type;
    },

    norm: function () {
        var args = Array.fromArguments(arguments);
        var arg;
        while (typeof arg === 'undefined' && args.length > 0) {
            arg = args.shift()
        }
        return arg;
    },

    // TODO: Refactoring!
    norms: function (object, norms) {
        if (typeof object === 'undefined' || object === null) return norms;
        if (arguments.length > 2) {
            var normsArray = Array.fromArguments(arguments);
            normsArray.shift();
            normsArray.each(function (norms) {
                XO(norms).copy(object, {overwrite: false});
            });
        }
        else {
            XO(norms).copy(object, {overwrite: false});
        }

        return object;
    }

});

});