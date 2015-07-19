/**
 * The Namespace ...
 * TODO: Documentation!
 */

script( {
    require: [
      'lib/jsz/core/Function.js'
    ]
}, function() {

/**
 * This function generate a jsz-namespace from the param namespace.
 * example:
 * {code}
 * var x = namespace('foo.bar');
 * alert(foo.toString());        // [foo:_jsz_.Namespace]
 * alert(foo.bar.toString());    // [foo.bar:_jsz_.Namespace]
 * {code}
 * Namespaces are just js-objects.
 *
 * @param namespacePath:String
 * @return namespace:Namespace
 */
window.namespace = function(namespacePath) {

    if (namespacePath === undefined) {
        throw new Error("No path for namespace given.");
    }

    var pathParts = namespacePath.split(JSZ.DOT),
        currentNamespace = window, // The root of all namespaces.
        path = JSZ.EMPTY_STRING;

    // Walk along the given path.
    pathParts.forEach(function (pathPart) {
        path += path === JSZ.EMPTY_STRING ? pathPart : JSZ.DOT + pathPart;

        if (!currentNamespace[pathPart]) {
            currentNamespace[pathPart] = new _jsz_.Namespace(path);
        }

        currentNamespace = currentNamespace[pathPart];
    });

    return currentNamespace;
}

window.module = function( name) {
    var ns = namespace( name);
    ns._jsz_.module = name;
    return ns;
}

// The namespace object.
_jsz_.Namespace = function (path) {
    this._jsz_ = {path: path};
};

/**
 * @type boolean
 * A flag to turn debuging for namespaces on and off
 */
_jsz_.Namespace.debug = false;

// TODO: Documentation!
_jsz_.Namespace.extending = false;

/**
 * toString
 */
_jsz_.Namespace.prototype.toString = function () {
    return "[Namespace:" + this._jsz_.path + "]";
};

/**
 * Creates a module
 *
 * @param name
 * @returns module
 */
_jsz_.Namespace.prototype.module = function (name) {
    if ( this[name] !== undefined) {
        throw new Error( name + " ist not a valid name for a module!");
    }

    var module = namespace(this._jsz_.path + JSZ.DOT + name);
    module._jsz_.module = name;

    return module;
};


/**
 *  def to define things for a module
 *  TODO: Documentation!
 */
_jsz_.Namespace.prototype.def = function (object) {
    if (this._jsz_.module === undefined) {
        throw new Error("Not a module!");
    }

    var key,
        moduleInitFunction = null,
        moduleName = this._jsz_.module;

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            if (key === moduleName && typeof object[key] === 'function') {
                moduleInitFunction = object[key];
            }
            else {
                this[key] = object[key];
            }
        }
    }

    // initialize module
    if (moduleInitFunction !== null) {
        moduleInitFunction.apply(this);
    }

    return this;
};

/**
 * class
 * TODO: Documentation
 */
_jsz_.Namespace.prototype.class = function (className, extend) {

    var namespace = this,
        inners,
        firms,
        fullClassName = namespace._jsz_.path + '.' + className;


    // Check arguments count.
    if (!(arguments.length === 1 || arguments.length === 2)) {
        throw new Error('Wrong count of parameters for _jsz_.Namespace.Class!');
    }

    // Generate the new class.
    var newClass = _jsz_.Namespace.getNewClass(namespace, className, extend);

    _jsz_.classes[fullClassName] = newClass;

    // Every class extends jsz.Object.
    newClass.prototype = new jsz.Object();

    // If the class will be extended
    if (extend !== undefined) {
        // Extend the class with the given sub class.
        _jsz_.Namespace.extending = true;
        /* jshint ignore:start */
        newClass.prototype = new extend();
        /* jshint ignore:end */
        _jsz_.Namespace.extending = false;

        // add firms to the class
        firms = extend._jsz_.firms;
        if (firms !== undefined) {
            var key;
            for (key in firms) {
                if (firms.hasOwnProperty(key)) {
                    newClass[key] = firms[key];
                }
            }
        }

        inners = extend._jsz_.inners;
    }

    // Set meta-infos for the new class
    newClass._jsz_ = {
        className: className,
        namespace: namespace,
        extend: extend,
        inners: inners,
        firms: firms
    };

    // Add new class to the namespace.
    this[className] = newClass;

    return newClass;
};

/**
 * class
 * TODO: Documentation
 */
_jsz_.Namespace.getNewClass = function (namespace, className, extension) {
    // Returns the function that will be our class and constructor.
    return function () {
        // Build an object when the extending-mode is not active.
        if (!_jsz_.Namespace.extending) {
            var thisClass = namespace[className];
            var metaClass = thisClass._jsz_;
            var newObject = null;

            // TODO: singelton are not implemented coplete
            if (metaClass.singleton === true) {
                var fullClassName = namespace.path() + JSZ.DOT + className;
                if (_jsz_.singletons[fullClassName] === undefined) {
                    _jsz_.singletons[fullClassName] = this;
                }
                else {
                    newObject = _jsz_.singletons[fullClassName];
                }
            }
            else {
                newObject = this;

                // Set meta-info for the new object
                newObject._jsz_ = {
                    className: className,
                    namespace: namespace,
                    extend: extension || false,
                    super: 0 // auxiliary variable for the constructor chain
                };

                // handle inners
                /* TODO: handle inners
                 if ( metaClass.inners) {
                 jsz.util.inners( this, metaClass.inners);
                 }
                 */

                // call the constructor
                if (newObject[className]) {
                    newObject[className].apply(newObject, arguments);
                }

                delete newObject._jsz_.super;
            }

            return newObject;
        }
    };
};

/**
 * Creates a simple Class
 * TODO: Documentation!
 */
_jsz_.Namespace.prototype.proto = function () {
    var name, base, def;

    name = arguments[0];

    if (arguments.length === 2) {
        base = null;
        def = arguments[1];
    }
    else {
        base = arguments[1];
        def = arguments[2];
    }

    var newClass = typeof def[name] === 'undefined' ? function () {
    } : def[name];


    var key;
    for (key in def) {
        if (def.hasOwnProperty(key) && key !== name) {
            newClass.prototype[key] = def[key];
        }
    }

    if (base !== null) {
        newClass.prototype = base.prototype;
    }

    this[name] = newClass;
};

namespace('jsz');

});