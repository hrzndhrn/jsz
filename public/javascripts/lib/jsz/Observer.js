/**
 * TODO: Documentation
 */
script({
  name: 'lib.jsz.Observer'
}, function() {
  'use strict';

  namespace('jsz').class('Observer').def({

    _path_: JSZ.EMPTY_STRING,
    _callback_: {},
    _data_: {},

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

      this._path_ = config.path === JSZ.EMPTY_STRING ?
        config.path : config.path + '.';

      this._data_ = {
        current: {},
        snapshot: {}
      };

      // prepare data
      Object.keys(config.data).forEach(function(key) {
        if (jsz.isObject(config.data[key])) {
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
        setter: unite(config.callback.setter, config.callback.scope),
        getter: unite(config.callback.getter, config.callback.scope)
      };

      jsz.Observer.defineProperties(this, object, config.data);

      Object.freeze(object);

    },

    _setter_: function(key, value) {
      this._callback_.setter(this._path_ + key, value);
      this._data_.current[key] = value;
    },

    _getter_: function(key) {
      var value = this._data_.current[key];
      this._callback_.getter(this._path_ + key, value);
      return value;
    },

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

    hasChanges: function() {
      return !this.hasNoChanges();
    }

  });

  /**
   *
   * @param {jsz.Observer} observer
   * @param {Object} object
   * @param {Object} properties
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

  jsz.Observer.getter = function(observer, key) {
    return function() {
      return observer._getter_(key);
    };
  };

  jsz.Observer.setter = function(observer, key) {
    return function(value) {
      observer._setter_(key, value);
    };
  };

});


