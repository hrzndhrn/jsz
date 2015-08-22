/**
 * TODO: Documentation
 */
script({
  name: 'lib.jsz.Observer'
}, function() {
  'use strict';

  namespace('jsz').proto('Observer', {

    Observer: function(object, config) {
      if (arguments.length === 1) {
        config = object;
        object = this;
      }

      log.dir(config);

      config = jsz.defaults(config, {
        callback: {},
        path: JSZ.EMPTY_STRING
      });

      log.dir(config);

      var path = config.path === JSZ.EMPTY_STRING ?
        config.path : config.path + '.';

      var data = {
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
          data.snapshot[key] = config.data[key];
        }

        data.current[key] = config.data[key];
      });

      Object.defineProperty(this, '_path_', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: path
      });

      Object.defineProperty(this, '_callback_', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: {
          setter: unite(config.callback.setter, config.callback.scope),
          getter: unite(config.callback.getter, config.callback.scope)
        }
      });

      Object.defineProperty(this, '_data_', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {
          snapshot: data.snapshot,
          current: data.current
        }
      });

      Object.defineProperty(this, '_getter_', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(key) {
          var value = this._data_.current[key];
          this._callback_.getter(this._path_ + key, value);
          return value;
        }
      });

      Object.defineProperty(this, '_setter_', {
        enumerable: false,
        configurable: false,
        // writable: false,
        value: function(key, value) {
          this._callback_.setter(this._path_ + key, value);
          this._data_.current[key] = value;
        }
      });

      jsz.Observer.addProperties(this, object, config.data);

      Object.freeze(this);

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

  jsz.Observer.addProperties = function(observer, object, properties) {
    Object.keys(properties).forEach(function(key) {
      Object.defineProperty(object, key, {
        enumerable: true,
        configurable: false,
        // writable: false,
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


