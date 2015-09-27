script({
  name: 'lib.jsz.core.Listener',
  require: [
    'lib.jsz.core.Array',
    'lib.jsz.core.Namespace',
    'lib.jsz.core.Object',
    'lib.jsz.core.HTMLElement'
  ]
}, function () {
  'use strict';

  _jsz_.listeners = {};

  namespace('jsz').class('Listener').def({
    Listener: function (id, element, type, callback, config) {
      this.id = id;
      this._element = element;
      this._type = type; // the event type
      this._callback = callback;

      this._avoidPropagation = jsz.default(config.avoidPropagation, false);

      this._avoidDefault = jsz.default(config.avoidDefault, true);
      if (this._element.isType('FILE')) {
        // For the input element of type file its impossible to avoid
        // the default.
        this._avoidDefault = false;
      }


      this._capture = jsz.default(config.capture, false);

      // The returnType indicates the argument for the callback.
      this._returnType = jsz.default(config.returnType, 'listener');
      // possible values:
      var returnTypes = [
        'listener', // The listener that handled the event.
        'event', // The event-object
        'target', // The target-element of the event
        'element' // The element of the listener
        // TODO: implement posInElement, posInDocument, posInContent
        // 'posInElement', // The click-position in the element
        // 'posInDocument', // The click-position in the document
        // 'posInContent'// The click-position in the content
      ];
      // check
      if (!returnTypes.contains(this._returnType)) {
        throw new Error(
          'Not a valid returnType! returnType = ' + this._returnType);
      }
    },

    _avoidDefault: true,
    _avoidPropagation: false,

    activate: function () {
      jsz.Listener.activate(this.id);
    },

    deactivate: function () {
      jsz.Listener.deactivate(this.id);
    },

    fire: function (event) {
      if (this._avoidDefault) {
        event.preventDefault();
      }

      if (this._avoidPropagation) {
        event.stopPropagation();
      }

      this._callback(this._getReturnType(event));
    },

    _getReturnType: function (event) {
      var returnType = null;
      switch (this._returnType) {
        case 'listener':
          returnType = this;
          break;
        case 'event':
          returnType = event;
          break;
        case 'target':
          returnType = new jsz.HTMLElement(event.target);
          break;
        case 'element':
          returnType = this._element;
          break;
      }

      return returnType;
    }


  }).static({

    _handles: {},
    _ID_PREFIX: 'lsr:',
    _idCounter: 0,
    _listeners: {},
    _typeMap: {
      returnKey: 'keydown',
      escKey: 'keydown'
    },

    /**
     * The jsz.Listener.add methods registers a listener on an element.
     * @params
     *   element:[jsz.HTMLElement|String],
     *   type:['click'|...],
     *   fun:callback:Function,
     *   [ scope:jsz.Object,
     *     config:{returntype, ...}]
     * @returns listener:jsx.Listener
     */
    add: function (element, type, fun, scope, config) {
      var args = this._args4add(element, type, fun, scope, config);

      var id = this._newId();
      this._handles[id] = this._getHandleFunction(id);

      // Their are some more listener types as event types, so the event type
      // can differ from the listener type.
      // e.g.: listener type returnKey - event type keydown
      type = this._typeMap[args.type] || args.type;

      _jsz_.listeners[id] = new this(
        id, args.element, type, args.callback, args.config);


      if (args.config.active !== false) {
        this.activate(id);
      }

      return _jsz_.listeners[id];
    },

    activate: function (id) {
      var listener = _jsz_.listeners[id];
      var handle = this._handles[id];
      var element = listener._element.get();

      element.addEventListener(
        listener._type,
        handle,
        listener._capture
      );
    },

    deactivate: function (id) {
      var listener = _jsz_.listeners[id];
      var handle = this._handles[id];
      var element = listener._element.get();

      element.removeEventListener(
        listener._type,
        handle,
        listener._capture
      );
    },

    _args4add: function (element, type, fun, scope, config) {
      var object = {
        element: element,
        type: type,
        callback: fun,
        config: {}
      };

      if (scope instanceof jsz.Object || scope instanceof _jsz_.Namespace) {
        object.callback = unite(object.callback, scope);
        object.config = jsz.default(config, {});
      }
      else {
        // change argument scope to config
        object.config = jsz.default(scope, {});
      }

      if (typeof object.element === 'string') {
        object.element = $id(object.element);
      }

      if (object.element.isEmpty()) {
        throw new Error('Missing element for listener!');
      }

      // TODO: This part needs a refactoring when jsz.gui is reimplemented.
      if (jsz.gui && ( object.element instanceof jsz.gui.Object)) {
        log.warn(
          'TODO: This part needs a refactoring when jsz.gui is reimplemented.');
        object.element = object.element.element;
      }

      return Object.freeze(object);
    },

    _newId: function () {
      return this._ID_PREFIX + this._idCounter++;
    },

    _getHandleFunction: function (id) {
      return function (event) {
        _jsz_.listeners[id].fire(event);
      };
    }

  });

});