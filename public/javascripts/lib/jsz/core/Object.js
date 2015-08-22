// TODO: Documentation

/**
 * This script contains the implementation of jsz.Object, some static
 * functions for the built-in Object and the function object to create simple
 * objects.
 */
script({
  name: 'lib.jsz.core.Object',
  require: ['lib.jsz.core.Namespace']
  // require: []
}, function () {
  'use strict';

  jsz.Object = function () {};

  jsz.Object.prototype.getClass = function () {
    return _jsz_.classes[this.getClassName()];
  };

  jsz.Object.prototype.toString = function () {
    return '[object ' + this.getClassName() + ']';
  };

  jsz.Object.prototype.getClassName = function () {
    return this._jsz_.namespace._jsz_.path + JSZ.DOT + this._jsz_.className;
  };

  jsz.Object.prototype.super = function () {
    var i = 0,
      skip = this._jsz_.super; // skip n constructors

    var extend = this._jsz_.extend;
    for (i; i < skip; i++) {
      // skip constructors
      extend = extend._jsz_.extend;
    }


    if (extend !== undefined) {
      this._jsz_.super++;

      var baseClass = extend;
      var baseClassName = baseClass._jsz_.className;
      var baseConstructor = baseClass.prototype[baseClassName];

      if (baseConstructor) {
        baseConstructor.apply(this, arguments);
      }
      else {
        if (extend) {
          this.super.apply(this, arguments);
        }
      }

      this._jsz_.super--;
    }

  };

  // ===========================================================================
  // Static functions for the built-in Object.

  /**
   * Creates an identical object form the specified object.
   *
   * @note For the moment its works just right for plain objects.
   *
   * @param {*} object
   * @returns {*}
   */
  Object.clone = function (object) {
    if (object === undefined) {
      throw new Error('Can not clone undefined!');
    }

    var newObject = {};

    if (jsz.isPlainObject(object)) {
      Object.keys(object).forEach(function(key) {
        var value = object[key];

        if (jsz.isPlainObject(value)) {
          newObject[key] = Object.clone(value);
        }
        else {
          newObject[key] = value;
        }
      });
    }
    else if (object.clone !== undefined) {
      newObject = object.clone();
    }
    else {
      throw new Error('Can not clone object!');
    }

    return newObject;
  };

  /**
   * Returns true if the given object has no enumerable keys.
   *
   * @param {Object} object
   * @returns {boolean}
   */
  Object.isEmpty = function (object) {
    return Object.keys(object).isEmpty();
  };

  /**
   * The addProperty function is a special form of defineProperty. This function
   * detects the descriptor enumerable and enumerable by the given propName.
   * For propNames starts with _ the enumerable key will be set to false
   * otherwise to true.
   * For propNames with only upper case characters the writable key will be set
   * to false otherwise to true.
   * The keys get and set remain unset.
   * The key configurable will be set to false by default.
   *
   * @param {Object} object
   * @param {String} propName
   * @param {*} value
   */
  Object.addProperty = function(object, propName, value) {
    Object.defineProperty(
      object, propName, Object.createDescriptor(propName, value));
  };

  /**
   * The addProperties function is a special form of defineProperties. The
   * argument props is a key value object wherein the key is the property name
   * and the value is the property value. At this point addProperties works like
   * as addProperty for all properties in props.
   *
   * @param {Object} object
   * @param {Object.<String,*>} props
   */
  Object.addProperties = function(object, props) {
    Object.defineProperties( object, Object.createDescriptors(props));
  };

  /**
   * This function returns a descriptor for defineProperty by the rules that
   * are defined in addProperty.
   *
   * @param propName
   * @param value
   */
  Object.defineProperty(Object, 'createDescriptor', {
    enumerable: false,
    writable: false,
    configurable: false,
    value:    function(propName, value) {
      return {
        // If key starts with '_' then set enumerable to false.
        enumerable: propName.indexOf('_') !== 0,
        // If key indicates a constant then set writeable to false.
        writable: !(/^[A-Z|_]*$/).test(propName),
        // configurable is by default false
        configurable: false,
        value: value
      };
    }
  });

  /**
   * This function returns a descriptors object for defineProperties by the
   * rules that are defined in addProperty.
   *
   * @param propName
   * @param value
   */
  Object.defineProperty(Object, 'createDescriptors', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function(props) {
      return Object.keys(props).reduce(
        function(descriptors, propName) {
          descriptors[propName] =
            Object.createDescriptor(propName, props[propName]);
          return descriptors;
        }, {});
    }
  });

  // ===========================================================================
  // window.object to create objects on the fly
  /**
   *
   * @param {Function} [init]
   * @param {Object} properties
   * @returns {jsz.Object}
   */
  window.object = function(init, properties) {
    if ( arguments.length === 1) {
      properties = init;
      init = null;
    }
    var object = Object.create(Object.prototype,
      Object.createDescriptors(properties));

    if (init !== null) {
      init.apply(object);
    }

    return object;
  };

});