/**
 * The Namespace ...
 * TODO: Documentation!
 */

script({
  name: 'lib.jsz.core.Namespace',
  require: [
    'lib.jsz.core.main',
    'lib.jsz.core.Function'
  ]
}, function () {
  'use strict';

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
  window.namespace = function (namespacePath) {

    if (namespacePath === undefined) {
      throw new Error('No path for namespace given.');
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
  };

  window.module = function (name) {
    var ns = namespace(name);
    ns._jsz_.module = name;
    return ns;
  };

// The namespace object.
  _jsz_.Namespace = function (path) {
    this._jsz_ = {path: path};
  };

  /**
   * toString
   */
  _jsz_.Namespace.prototype.toString = function () {
    return '[Namespace:' + this._jsz_.path + ']';
  };

  /**
   * Creates a module
   *
   * @param name
   * @returns module
   */
  _jsz_.Namespace.prototype.module = function (name) {
    if (this[name] !== undefined) {
      console.trace();
      throw new Error(name + ' ist not a valid name for a module!');
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
      throw new Error('Not a module!');
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
  _jsz_.Namespace.prototype.class = function () {
    var className, extend = null;

    // Check arguments
    if (arguments.length === 1){
      className = arguments[0];
    }
    else if (arguments.length === 2) {
      className = arguments[0];
      if (arguments[1]) {
        extend = arguments[1];
      }
      else {
        throw new Error('The class ' + className +
          ' can not extend with undefined.');
      }
    }
    else {
      throw new Error('Wrong count of parameters for _jsz_.Namespace.Class!');
    }

    var namespace = this,
      inners,
      firms,
      fullClassName = namespace._jsz_.path + '.' + className;


    // Generate the new class.
    var newClass = _jsz_.Namespace.getNewClass(namespace, className, extend);

    // Add the class to the jsz class direcotry.
    _jsz_.classes[fullClassName] = newClass;

    // toString for the class
    newClass.toString = _jsz_.classToString;

    // If the class will be extended
    if (extend === null) {
      // Every base class extends jsz.Object.
      newClass.prototype = Object.create(jsz.Object.prototype);
    }
    else {
      newClass.prototype = Object.create(extend.prototype);

      // add firms to the class
      // TODO: implement firms
      /*
       firms = extend._jsz_.firms;
       if (firms !== undefined) {
       var key;
       for (key in firms) {
       if (firms.hasOwnProperty(key)) {
       newClass[key] = firms[key];
       }
       }
       }
       */

      // TODO: implements inners
      /*
       inners = extend._jsz_.inners;
       */
    }

    // Set meta-infos for the new class
    Object.defineProperty(newClass, JSZ.META, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: {
        className: className,
        namespace: namespace,
        extend: extend,
        inners: inners,
        firms: firms
      }
    });

    Object.defineProperty(newClass, 'getClassName', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function() {
        return this[JSZ.META].namespace._jsz_.path +
          JSZ.DOT + this[JSZ.META].className;
      }
    });

    // Looking for a class-constructor
    console.log('looking for the class-constructor for class ' + className);
    while(extend) {
      console.log(extend);
      if (extend[extend[JSZ.META].className]) {
        console.log('>>>>> has a class-constructor');
        console.log(extend[extend[JSZ.META].className]);
        // apply the class-constructor to the new class
        // newClass.apply(extend[extend[JSZ.META].className]);
        extend[extend[JSZ.META].className].apply(newClass);
        extend = extend[extend[JSZ.META].extend];
      }
      else {
        // go up to the hierarchy
        extend = extend[extend[JSZ.META].extend];
      }
    }

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
      var thisClass = namespace[className];
      var metaClass = thisClass[JSZ.META];
      var newObject = null;

      // Create a new object.
      newObject = Object.create(thisClass.prototype, metaClass.properties);

      // Set meta-info for the new object
      Object.defineProperty(newObject, JSZ.META, {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {
          className: className,
          namespace: namespace,
          extend: extension || null,
          super: 0 // auxiliary variable for the constructor chain
        }
      });

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
      else {
        log.debug('call the super');
        var superClass = newObject[JSZ.META].extend;
        while(superClass !== null) {
          var superClassName = superClass[JSZ.META].className;
          log.dir(superClass.prototype[superClassName]);
          if( superClass.prototype[superClassName]) {
            superClass.prototype[superClassName].apply(newObject, arguments);
            log.dir(superClass[JSZ.META]);
            superClass = null;
          }
          else {
            superClass = superClass[JSZ.META].extend;
          }
          log.debug('superClassName: ' + superClassName);
          // superClass = null;
        }
      }

      // delete auxiliary variable for the constructor chain
      delete newObject[JSZ.META].super;

      if (_jsz_.sealObjects) {
        Object.seal(newObject);
      }

      return newObject;

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
      newClass.prototype = Object.create(base.prototype);
    }

    this[name] = newClass;
  };

  namespace('jsz');

});