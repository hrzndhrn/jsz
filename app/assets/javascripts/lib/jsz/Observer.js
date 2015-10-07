/**
 * This script contains teh jsz.Observer.
 * @version: 0.1.0
 */
script({
  name: 'lib.jsz.Observer'
}, function() {
  'use strict';

  /**
   * The jsz.Observer monitored get and set operation on an object.
   */
  namespace('jsz').class('Observer').def({

    _path_: JSZ.EMPTY_STRING,
    _callback_: {},
    _data_: {},

    /**
     * The constructor for the jsz.Observer. The observation can be internal or
     * external. If the constructor get just a config then the observation is
     * internal and the created object contains the data. In this case the value
     * config.data is mandatory. If the constructor get an object and a config
     * then the observation is external. In this case is the value config.data
     * optional.
     * Plain objects will become nested observer objects and other objects will
     * become values of the observer.
     *
     * @param {Object} [object] - The object to monitor.
     * @param {Object} config - The observer configuration.
     * @param {Object} config.callback
     * @param {Function} config.callback.setter - This callback will be called
     *  when a property of the observed object was set.
     * @param {Function} config.callback.getter - This callback will be called
     *  when a property of the observed object was get.
     * @param {Object} config.callback.scope - The scope for the setter and
     *  getter callbacks.
     * @param {Object} [config.data] - Initial data for the monitored object.
     * @constructor
     */
    Observer: function(object, config) {
      if (arguments.length === 1) {
        // internal: The observer holds the data
        config = object;
        object = this;
      }
      else {
        // external: The data exist in a different object.
        config.data = jsz.default(config.data, object);
      }

      config = jsz.defaults(config, {
        callback: {},
        path: JSZ.EMPTY_STRING
      });

      // Save the path for nested observer objects.
      this._path_ = config.path === JSZ.EMPTY_STRING ?
        config.path : config.path + '.';

      this._data_ = {
        current: {}, // to save the current values
        snapshot: {} // to save the initial values and or snapshots
      };

      // Prepare data that will be observed.
      Object.keys(config.data).forEach(function(key) {
        if (jsz.isPlainObject(config.data[key])) {
          config.data[key] = new jsz.Observer({
            data: config.data[key],
            callback: config.callback,
            path: key
          });
        }
        else {
          this._data_.snapshot[key] = config.data[key];
        }

        this._data_.current[key] = config.data[key];
      }, this);

      this._callback_ = {
        setter: bind(config.callback.setter, config.callback.scope),
        getter: bind(config.callback.getter, config.callback.scope)
      };

      // Define the properties for the observed object.
      jsz.Observer.defineProperties(this, object, config.data);

      // Freeze the object to prevent the object for extension.
      Object.freeze(object);
    },

    /**
     * The setter to observe set operation of the observed object.
     *
     * @param key
     * @param value
     * @private
     */
    _setter_: function(key, value) {
      this._callback_.setter(this._path_ + key, value);
      this._data_.current[key] = value;
    },

    /**
     * The getter to observe get operation of the observed object.
     *
     * @param key
     * @returns {*}
     * @private
     */
    _getter_: function(key) {
      var value = this._data_.current[key];
      this._callback_.getter(this._path_ + key, value);
      return value;
    },

    /**
     * Returns true if the object was not changed after observation was started
     * or a snapshot was taken.
     *
     * @returns {boolean}
     */
    hasNoChanges: function() {
      var current = this._data_.current;
      var snapshot = this._data_.snapshot;

      return Object.keys(current).every(function(key) {
        var result = false;
        var currentValue = current[key];
        if (currentValue instanceof jsz.Observer) {
          result = currentValue.hasNoChanges();
        }
        else {
          result = currentValue === snapshot[key];
        }

        return result;
      });
    },

    /**
     * Returns true if the object was changed after observation was started or
     * a snapshot was taken.
     *
     * @returns {boolean}
     */
    hasChanges: function() {
      return !this.hasNoChanges();
    },

    /**
     * This methods takes a snapshot of the observed object to mark the object
     * as unchanged. After a snapshot the method hasChanges will return false
     * until the object will be changed.
     */
    snapshot: function() {
      Object.keys(this._data_.current).forEach(function(key) {
        var value = this._data_.current[key];
        if (value instanceof jsz.Observer) {
          value.snapshot();
        }
        else {
          this._data_.snapshot[key] = value;
        }
      }, this);
    }

  });

  /**
   * Defines all properties for the observed object an links the getters and
   * setters to the observer object.
   *
   * @param {jsz.Observer} observer
   * @param {Object} object
   * @param {Object} properties
   * @static
   */
  jsz.Observer.defineProperties = function(observer, object, properties) {
    Object.keys(properties).forEach(function(key) {
      Object.defineProperty(object, key, {
        enumerable: true,
        configurable: false,
        get: jsz.Observer.getter(observer, key),
        set: jsz.Observer.setter(observer, key)
      });
    });
  };

  /**
   * Returns the handler for the get observation.
   *
   * @param observer
   * @param key
   * @returns {Function}
   * @static
   */
  jsz.Observer.getter = function(observer, key) {
    return function() {
      return observer._getter_(key);
    };
  };

  /**
   * Returns the handler for the set observation.
   *
   * @param observer
   * @param key
   * @returns {Function}
   * @static
   */
  jsz.Observer.setter = function(observer, key) {
    return function(value) {
      observer._setter_(key, value);
    };
  };

});


