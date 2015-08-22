script({
  name: 'test.jsz.observer',
  require: [
    'lib.jsz.Observer',
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.Observer').add(
    new jsz.unit.TestCase({
      name: 'internal',
      setup: function() {
        this.assert = jsz.unit.assert;
        this.history = [];

        this.setter = function(key, value) {
          var string = 'set: ' + key + ' = ' + value;
          log.debug(string);
          this.history.push(string);
        };

        this.getter = function(key, value) {
          var string = 'get: ' + key + ' = ' + value;
          log.debug(string);
          this.history.push(string);
        };
      },
      tests: [
        {name: 'create'},
        {name: 'get01'},
        {name: 'historyGet01'},
        {name: 'historySet01'},
        {name: 'get02'},
        {name: 'historyGet02'}
      ],
      methods: {
        create: function() {
          this.object = new jsz.Observer({
            callback: {
              setter: this.setter,
              getter: this.getter,
              scope: this
            },
            data: {
              a:1,b:2,c:{d:4,e:5}
            }
          });
          this.assert.isDefined(this.object);
        },

        get01: function() {
          this.assert.isEqual(this.object.a, 1);
          this.assert.isEqual(this.object.b, 2);
          this.assert.isEqual(this.object.c.d, 4);
        },

        historyGet01: function() {
          this.assert.isEqual(this.history[0], 'get: a = 1');
          this.assert.isEqual(this.history[1], 'get: b = 2');
          this.assert.isEqual(this.history[2], 'get: c = [object Object]');
          this.assert.isEqual(this.history[3], 'get: c.d = 4');
        },

        historySet01: function() {
          this.object.a = 11;
          this.object.b = 12;
          this.object.c.d = 14;

          this.assert.isEqual(this.history[4], 'set: a = 11');
          this.assert.isEqual(this.history[5], 'set: b = 12');
          this.assert.isEqual(this.history[6], 'get: c = [object Object]');
          this.assert.isEqual(this.history[7], 'set: c.d = 14');
        },

        get02: function() {
          this.assert.isEqual(this.object.a, 11);
          this.assert.isEqual(this.object.b, 12);
          this.assert.isEqual(this.object.c.d, 14);
        },

        historyGet02: function() {
          this.assert.isEqual(this.history[8], 'get: a = 11');
          this.assert.isEqual(this.history[9], 'get: b = 12');
          this.assert.isEqual(this.history[10], 'get: c = [object Object]');
          this.assert.isEqual(this.history[11], 'get: c.d = 14');
        }

      }

    })
  ).add(
    new jsz.unit.TestCase({
      name: 'external',
      setup: function() {
        this.assert = jsz.unit.assert;
        this.history = [];

        this.setter = function(key, value) {
          var string = 'set: ' + key + ' = ' + value;
          log.debug(string);
          this.history.push(string);
        };

        this.getter = function(key, value) {
          var string = 'get: ' + key + ' = ' + value;
          log.debug(string);
          this.history.push(string);
        };
      },
      tests: [
        {name: 'create'},
        {name: 'get01'},
        {name: 'historyGet01'},
        {name: 'historySet01'},
        {name: 'get02'},
        {name: 'historyGet02'}
      ],
      methods: {
        create: function() {
          this.object = {};
          new jsz.Observer( this.object, {
            callback: {
              setter: this.setter,
              getter: this.getter,
              scope: this
            },
            data: {
              a:1,b:2,c:{d:4,e:5}
            }
          });
          this.assert.isDefined(this.object);
        },

        get01: function() {
          this.assert.isEqual(this.object.a, 1);
          this.assert.isEqual(this.object.b, 2);
          this.assert.isEqual(this.object.c.d, 4);
        },

        historyGet01: function() {
          this.assert.isEqual(this.history[0], 'get: a = 1');
          this.assert.isEqual(this.history[1], 'get: b = 2');
          this.assert.isEqual(this.history[2], 'get: c = [object Object]');
          this.assert.isEqual(this.history[3], 'get: c.d = 4');
        },

        historySet01: function() {
          this.object.a = 11;
          this.object.b = 12;
          this.object.c.d = 14;

          this.assert.isEqual(this.history[4], 'set: a = 11');
          this.assert.isEqual(this.history[5], 'set: b = 12');
          this.assert.isEqual(this.history[6], 'get: c = [object Object]');
          this.assert.isEqual(this.history[7], 'set: c.d = 14');
        },

        get02: function() {
          this.assert.isEqual(this.object.a, 11);
          this.assert.isEqual(this.object.b, 12);
          this.assert.isEqual(this.object.c.d, 14);
        },

        historyGet02: function() {
          this.assert.isEqual(this.history[8], 'get: a = 11');
          this.assert.isEqual(this.history[9], 'get: b = 12');
          this.assert.isEqual(this.history[10], 'get: c = [object Object]');
          this.assert.isEqual(this.history[11], 'get: c.d = 14');
        }

      }

    })
  ).add(
    new jsz.unit.TestCase({
      name: 'external scan',
      setup: function() {
        this.assert = jsz.unit.assert;
        this.history = [];

        this.setter = function(key, value) {
          var string = 'set: ' + key + ' = ' + value;
          log.debug(string);
          this.history.push(string);
        };

        this.getter = function(key, value) {
          var string = 'get: ' + key + ' = ' + value;
          log.debug(string);
          this.history.push(string);
        };
      },
      tests: [
        {name: 'create'},
        {name: 'get01'},
        {name: 'historyGet01'},
        {name: 'historySet01'},
        {name: 'get02'},
        {name: 'historyGet02'}
      ],
      methods: {
        create: function() {
          this.object = {};
          new jsz.Observer( this.object, {
            callback: {
              setter: this.setter,
              getter: this.getter,
              scope: this
            }
          });
          this.assert.isDefined(this.object);
        },

        get01: function() {
          this.assert.isEqual(this.object.a, 1);
          this.assert.isEqual(this.object.b, 2);
          this.assert.isEqual(this.object.c.d, 4);
        },

        historyGet01: function() {
          this.assert.isEqual(this.history[0], 'get: a = 1');
          this.assert.isEqual(this.history[1], 'get: b = 2');
          this.assert.isEqual(this.history[2], 'get: c = [object Object]');
          this.assert.isEqual(this.history[3], 'get: c.d = 4');
        },

        historySet01: function() {
          this.object.a = 11;
          this.object.b = 12;
          this.object.c.d = 14;

          this.assert.isEqual(this.history[4], 'set: a = 11');
          this.assert.isEqual(this.history[5], 'set: b = 12');
          this.assert.isEqual(this.history[6], 'get: c = [object Object]');
          this.assert.isEqual(this.history[7], 'set: c.d = 14');
        },

        get02: function() {
          this.assert.isEqual(this.object.a, 11);
          this.assert.isEqual(this.object.b, 12);
          this.assert.isEqual(this.object.c.d, 14);
        },

        historyGet02: function() {
          this.assert.isEqual(this.history[8], 'get: a = 11');
          this.assert.isEqual(this.history[9], 'get: b = 12');
          this.assert.isEqual(this.history[10], 'get: c = [object Object]');
          this.assert.isEqual(this.history[11], 'get: c.d = 14');
        }

      }

    })

  );

});
