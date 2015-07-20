/* experimental
 namespace('jsx')
 .import()
 .class( 'Listener').def({
 */
namespace('jsx').Class('Listener').def({
  Listener: function (id, element, type, scope, func, config) {
    this.id = id;
    this.element = jsx.dom.bless(element);
    this.type = type;
    this.event = null;
    this.target = null;
    this.scope = scope;
    this.func = func;
    this.returnType = config.returnType;
    this.key = config.key;
    this.avoidDefault = typeof config.avoidDefault === 'undefined' ? true : config.avoidDefault;
    this.transaction = true;
    this.avoidPropagation = config.avoidPropagation || false;
    this.useCapture = typeof config.capture === 'undefined' ? false : config.capture;
    this.Class = jsx.Listener;
    this.container = true;
    /* wird momentan nur bei mouseout verwendet */
    this.relations = [];
    this.clickTimer = null;
    this.keys = config.keys || null;

    if (jsx.type.isUnset(this.func)) {
      throw new Error("No Function!");
    }

    this.element._listeners.push(this);

    if (jsx.type.isSet(config.container)) {
      this.container = config.container;
    }

    if (this.type !== 'click') {
      this.transaction = false;
    }

    if (this.element.isType('FILE')) {
      this.avoidDefault = false;
    }

    if (this.type === this.Class.RETURN_KEY
      || this.type === this.Class.ESC_KEY
      || this.type === this.Class.PASTE
      || this.type === this.Class.CUT) {
      this.avoidDefault = false;
    }

    if (typeof config.avoidDefault !== 'undefined') {
      this.avoidDefault = config.avoidDefault;
    }

    this.returnType = jsx.type.norm(this.returnType, 'listener');

    // TODO: returntypes as const
    var returnTypes = [
      'listener', 'event', 'target', 'element',
      'posInElement', 'posInDocument', 'posInContent'
    ];

    if (!returnTypes.contains(this.returnType)) {
      log.error('Wrong returnType >' + this.returnType + '<!');
      throw new Error('Wrong returnType >' + this.returnType + '<!');
    }

    // Support for click and doubleClick on one element!
    if (this.type === 'doubleClick') {
      throw new Error("No support for doubleClick in JSX yet!!! See JSX-61")
    }
    /*
     if ( this.type === 'click' || this.type === 'doubleClick') {
     var relations;
     var relationType;
     if ( this.type === 'click') {
     relationType = 'doubleClick';
     }

     if ( this.type === 'doubleClick') {
     relationType = 'click';
     }

     // This filter can be very expensive!!!
     jsx.Listener.filter( this.element, relationType).each( function( relation) {
     this.relations.push( relation);
     relation.relations.push( this);
     }, this);

     // log.dir({relations:this.relations});
     } */
  },

  removeRelation: function (relationTo) {
    this.relations.remove(function (relation) {
      return relation.id === relationTo.id;
    });
  },

  fire: function (event) {
    this.event = event;

    // log.debug("Listener.fire: id=" + this.id + ", element=" + this.element + ", type=" + this.type);

    /* mouseout check for containers */
    if (this.container && this.type === 'mouseout') {
      var node = (this.event.relatedTarget) ? this.event.relatedTarget : this.event.toElement;
      while (node && node.parentNode) {
        if (this.element === node) {
          return;
        }
        /* mouse is still in the container */
        node = node.parentNode;
      }
    }

    // store this event as last event
    jsx['Event'] = {last: this.event};

    // Processing type return: Cancel process for other keys as return.
    if (this.type === this.Class.RETURN_KEY) {
      if (this.event.getKeyCode() !== JSX.KEY.RETURN) return;
    }

    // Processing type esc: Cancel process for other keys as esc.
    if (this.type === this.Class.ESC_KEY) {
      if (this.event.getKeyCode() !== JSX.KEY.ESC) return;
    }

    // Processing type keydown for special keys: Cancel process for all other keys.
    if (this.type === 'keydown' && jsx.type.isSet(this.keys)) {
      if (!this.keys.contains(this.event.getKeyCode())) return;
    }

    this.target = event.target;
    /*
     if ( event.target ) {
     this.target = event.target;
     }
     else {
     this.target  = event.srcElement;
     event.target = event.srcElement;
     }
     */

    // jsx.mixin( event, jsx.extension.Event);

    // workaround for mailto
    // if ( !(event.target && event.target.href && event.target.href.startsWith('mailto:'))) {


    // var isMailTo = event.target !== null && event.target.isAttr && event.target.isAttr( 'href', /mailto:.*/);
    var isMailTo = event.target.isFull() && event.target.isAttr('href', /mailto:.*/);


    if (!isMailTo) {
      if (this.avoidDefault) {
        event.avoidDefault();
      }

      if (this.avoidPropagation) {
        event.avoidPropagation();
      }

      var returnValue = null;
      switch (this.returnType) {
        case 'listener':
          returnValue = this;
          break;
        case 'element':
          returnValue = this.element;
          break;
        case 'target':
          returnValue = this.target;
          break;
        case 'event':
          returnValue = this.event;
          break;
        case 'posInDocument':
          returnValue = this._posInDocument();
          break;
        case 'posInElement':
          returnValue = this._posInElement();
          break;
        case 'posInContent':
          returnValue = this._posInContent();
          break;
        default:
          log.error('No returnType found!');
          throw new Error('No returnType found!');
      }

      /* Wurde bei der Konfiguration ein key mit angegeben wird in returnValue
       der entsprechende Wert gesucht und als returnValue eingesetzt. */
      if (this.key) {
        returnValue = XO(returnValue).getValue(this.key, false);
      }

      try {
        this._fire(returnValue);
      }
      catch (error) {
        log.error(error);
      }

    }
  },

  _posInDocument: function () {
    var posX = 0;
    var posY = 0;

    if (this.event.pageX || this.event.pageY) {
      posX = this.event.pageX;
      posY = this.event.pageY;
    }
    else if (this.event.clientX || this.event.clientY) {
      posX = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posY = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {x: posX, y: posY};
  },

  _posInElement: function () {
    var posInDocument = this._posInDocument();
    var elementPos = this.element.getBoundingClientRect();
    return {
      x: Math.round(posInDocument.x - elementPos.left),
      y: Math.round(posInDocument.y - elementPos.top)
    };
  },

  _posInContent: function () {
    var posInDocument = this._posInDocument();
    var contentPos = this.element.positionContent();
    return {
      x: posInDocument.x - contentPos[0],
      y: posInDocument.y - contentPos[1]
    };
  },

  _fire: function (value, delayed) {
    /* cut and paste */
    if ((this.type === this.Class.PASTE || this.type === this.Class.CUT) && delayed !== true) {
      jsx.util.timer(1, function () {
        this._fire(value, true);
      }, this);
    }
    else if (this.type === this.Class.CLICK && this.hasRelationTo({type: this.Class.DOUBE_CLICK})) {
      if (this.clickTimer === null) {
        var self = this;
        this.clickTimer = setTimeout(function () {
          if (self.scope === null) {
            self.func.call(value);
          }
          else {
            self.func.apply(self.scope, [value]);
          }
          self.clickTimer = null;
        }, this.Class.DOUBLE_CLICK_TIMESPAN);
      }
    }
    else {
      if (this.type === this.Class.DOUBLE_CLICK && this.hasRelationTo({type: this.Class.CLICK})) {
        this.getRelationsTo({type: this.Class.CLICK}).each(function (relation) {
          clearTimeout(relation.clickTimer);
          relation.clickTimer = null;
        });
      }

      if (this.scope === null) {
        this.func.call(value);
      }
      else {
        this.func.apply(this.scope, [value]);
      }
    }
  },

  hasRelationTo: function (keys) {
    var bool = this.relations.length > 0;
    if (bool) {
      bool = this.relations.contains(function (relation) {
        return !XO(keys).find(function (value, key) {
          relation[key] !== value;
        });
      });
    }

    return bool;
  },

  getRelationsTo: function (keys) {
    var relations = [];
    if (this.relations.length > 0) {
      relations = this.relations.filter(function (relation) {
        return !XO(keys).find(function (value, key) {
          relation[key] !== value;
        });
      });
    }

    return relations;
  },

  DESTROY: function () {
    this.remove();
  },
  remove: function () {
    this.getRelationsTo(this.element).each(function (relation) {
      relation.removeRelation(this);
    }, this);
    delete this.relations;
    jsx.Listener.remove(this.id);
  },

  activate: function () {
    jsx.Listener._activate(this.id);

  },

  deactivate: function () {
    jsx.Listener._deactivate(this.id);
  },

  toString: function () {
    return '[' + this.id + ' Listener]';
  }
})
  .Static({
    _idCounter: 0,
    _ID_PREFIX: 'lsr:',

    _newId: function () {
      var id = this._ID_PREFIX + this._idCounter;
      this._idCounter++;
      return id;
    },

    _listeners: {},
    _handles: {},
    _domReadyListeners: {},
    _domReady: false,
    _transactionController: null,
    _shortcutListener: null,
    _shortcutListeners: {},

    setTransactionController: function (tc) {
      this._transactionController = tc;
    },

    register: function () {
      //@deprecated
      log.deprecate("weil doof - lieber Listener.add( .., [..,{activated:false}])");
      // Diese Methode richtet eine deaktivierten Listener ein.
      this._register = true;
      var lsr = this.add.apply(this, arguments);
      this._register = false;
      return lsr;
    },

    add: function () {
      var args = this._argsAdd(arguments);
      // log.dir({"Listener.add":args});
      var id = this._newId();
      this._handles[id] = this._getHandleFunction(id);

      if (args.type === 'resize' && !jsx.env.ua.ie && args.element !== window) {
        // Just the IE supports a resize on other elements as window. For other browsers we will fake this feature
        // with transition.
        // Add a ver short transition to the element
        // args.element.setStyle( 'transition', 'width: 0.1s, height: 0.1s');
        jsx.dom.setStyle(args.element, 'transition', 'width 0.01s, height 0.01s');
        // Change the event-type to transitionend
        args.type = 'transitionend';
      }

      // detect document.ready listeners
      if (args.type === 'ready' && args.element === document) {
        this._domReadyListeners[id] = new this(id, args.element, args.type, args.scope, args.func, {});
      }
      else { // element listeners
        var type = this._typeMap[args.type] || args.type;

        if (!this._register) {
          // Das Flag _register legt fest ob der eventHandler direkt angelegt werden soll.
          var capture = typeof args.config.capture === 'undefined' ? false : args.config.capture;
          this._activateHandle(args.element, type, this._handles[id], capture);
        }

        // TODO: Man könnte vielleicht das 'new this' vor das if verschieben und dann einfach activate(id) aufrufen.
        this._listeners[id] = new this(id, args.element, args.type, args.scope, args.func, args.config);

      }

      return this._listeners[id];
    },

    shortcut: function (mods, key, scope, func) {
      // Initialize the shorcut-handler if it is null
      if (this._shortcutListener === null) {
        this._shortcutListener = jsx.Listener.add(
          jsx.Listener._getShortcutElement(), 'keydown',
          jsx.Listener, jsx.Listener._shortcutFire,
          {returnType: 'event', avoidDefault: false});
      }

      // prepare arguments
      if (arguments.length === 3) {
        func = scope;
        scope = null;
      }

      if (!jsx.type.isArray(mods)) mods = [mods];

      // check key and convert in lower-case character
      if (key.length !== 1) throw new Error("jsx.Listener.shortcut accepts "
      + "just a single character as key.")

      // register listener
      if (!this._shortcutListeners[key.toUpperCase().charCodeAt(0)]) {
        this._shortcutListeners[key.toUpperCase().charCodeAt(0)] = [];
      }

      this._shortcutListeners[key.toUpperCase().charCodeAt(0)].push({
        ctrlKey: mods.contains(JSX.KEY.CTRL),
        altKey: mods.contains(JSX.KEY.ALT),
        shiftKey: mods.contains(JSX.KEY.SHIFT),
        scope: scope,
        func: func
      });
    },

    _shortcutFire: function (event) {
      var shortcut = this._shortcutListeners[event.getKeyCode()];

      if (typeof shortcut !== 'undefined') {
        var n = shortcut.length;
        for (var i = 0; i < n; i++) {
          if (shortcut[i].altKey === event.getAltKey()
            && shortcut[i].shiftKey === event.getShiftKey()
            && shortcut[i].ctrlKey === event.getCtrlKey()) {
            if (shortcut[i].scope === null) {
              shortcut[i].func();
            }
            else {
              shortcut[i].func.apply(shortcut.scope);
            }
          }
        }
      }
    },

    filter: function () {
      log.debug('Listener.filter: ' + Array.args(arguments).join(' ,'));
      var listeners = [],
        element = arguments[0],
        type = arguments[1],
        scope = arguments[2],
        func = arguments[3];

      if (arguments.length === 4) {
        // filter by element, type, function and scope
        listeners = XO(this._listeners).filter(function (listener) {
          return listener.func === func
            && listener.type === type
            && listener.scope === scope
            && listener.element === element;
        });
      }
      else if (arguments.length === 3) {
        // filter by element, type and function
        listeners = XO(this._listeners).filter(function (listener) {
          return listener.func === func
            && listener.type === type
            && listener.element === element;
        });
      }
      else if (arguments.length === 2) {
        // filter by element and type
        listeners = XO(this._listeners).filter(function (listener) {
          return listener.type === type
            && listener.element === element;
        });
      }
      else if (arguments.length === 1) {
        // filter by element
        listeners = XO(this._listeners).filter(function (listener) {
          return listener.element === element;
        });
      }


      return XO(listeners).values();
    },

    remove: function () {
      var listeners, type, scope, func, element;

      if (arguments.length === 4) {
        element = arguments[0];
        type = arguments[1];
        scope = arguments[2];
        func = arguments[3];
        XO(this._listeners).each(function (listener) {
          if (listener.func === func
            && listener.type === type
            && listener.scope === scope
            && listener.element.like(element)) {
            listener.remove();
          }
        });
      }
      else if (arguments.length === 3) {
        element = arguments[0];
        type = arguments[1];
        func = arguments[2];
        XO(this._listeners).each(function (listener) {
          if (listener.func === func && listener.type === type && listener.element.like(element)) {
            listener.remove();
          }
        });
      }
      else if (arguments.length === 2) {
        element = arguments[0];
        type = arguments[1];
        XO(this._listeners).each(function (listener) {
          if (listener.type === type && listener.element.like(element)) {
            listener.remove();
          }
        });
      }
      else {
        if (jsx.type.isString(arguments[0])) {
          // remove by id
          var id = arguments[0];

          type = this._listeners[id].type;
          type = this._typeMap[type] ? this._typeMap[type] : type;
          this._deactivateHandle(this._listeners[id].element, type, this._handles[id]);
          delete this._listeners[id];
          delete this._handles[id];
        }
        else if (arguments[0].remove) {
          // remove by object
          arguments[0].remove();
        }
      }
    },

    _deactivate: function (id) {
      // remove by id
      var type = this._listeners[id].type ? this._listeners[id].type : this._typeMap[type];
      this._deactivateHandle(this._listeners[id].element, type, this._handles[id]);
    },

    _activate: function (id) {
      var type = this._listeners[id].type ? this._listeners[id].type : this._typeMap[type];
      this._activateHandle(this._listeners[id].element, type, this._handles[id], this._listeners[id].useCapture);
    },

    _onDomReady: function () {
      XO(jsx.Listener._domReadyListeners).each(function (lsr) {
        lsr._fire();
      });
    },

    _onFire: function (id, event) {
      if (typeof this._listeners[id] === 'undefined') {
        log.warn('No listener for id ' + id + ' found!');
        return;
      }

      var listener = this._listeners[id];

      if (this._transactionController !== null && listener.transaction) {
        this._transactionController
          .set(listener, listener.fire, event)
          .start('jsx.Listener');
      }
      else {
        listener.fire(event);
      }
    },

    _getHandleFunction: function (id) {
      return function (event) {
        if (!event) event = window.event;
        jsx.Listener._onFire(id, new jsx.EventWrapper(event));
      }
    },

    _activateHandle: (function () {
      if (jsx.supported.addEventListener) {
        return function (element, type, func, capture) {
          if (element.isHTMLElementWrapper) {
            element = element.element;
          }
          element.addEventListener(type, func, capture);
        }
      }
      if (jsx.supported.attachEvent) { // IE
        return function (element, type, func, capture) {
          if (capture && type === 'focus') type = 'focusin';
          if (capture && type === 'blur') type = 'focusout';

          if (element.isHTMLElementWrapper) {
            element = element.element;
          }
          if (element === window && type !== 'scroll') element = window.document;
          element.attachEvent("on" + type, func);
        }
      }
    }()),

    _getShortcutElement: (function () {
      if (document.addEventListener) {
        return function () {
          return window;
        };
      }
      if (document.attachEvent) { // IE
        return function () {
          return document.body
        };
      }
    }()),

    check: function () {
      var config = jsx.type.norms(arguments[0], {verbose: false});

      if (config.verbose) {
        log.debug('listeners:', this);
      }
      XO(this._listeners).each(function (listener, id) {
        if (config.verbose) {
          log.debug('listener: id = ' + id, this);
          log.debug('scope: ' + listener.scope, this);
          log.debug('function: ' + typeof listener.func, this);
          log.debug('element: ' + listener.element);
          log.debug('handle: ' + typeof this._handles[id], this);
        }
        if (!jsx.type.isFunction(this._handles[id])) {
          log.error('No handle for listener "' + id + '"!');
        }
        if (!jsx.type.isFunction(listener.func)) {
          log.error('No function for listener "' + id + '"!');
        }
        if (jsx.type.isUndefined(listener.element)) {
          log.error('No element for listener "' + id + '"!');
        }
      }, this);

      if (config.verbose) {
        log.debug('handles:', this);
      }
      XO(this._handles).each(function (handle, id) {
        if (config.verbose) {
          log.debug('handle: id = ' + id, this);
          log.debug('handle: ' + typeof handle, this);
          log.debug('listener: ' + typeof this._listeners[id], this);
        }
        if (jsx.type.isUndefined(this._listeners[id]) && jsx.type.isUndefined(this._domReadyListeners[id])) {
          log.error('No listener-object for handle "' + id + '"!');
        }
      }, this);
    },

    _deactivateHandle: (function () {
      if (document.removeEventListener) {
        return function (element, type, func) {
          $id(element).element.removeEventListener(type, func, false);
        }
      }
      if (document.detachEvent) {
        return function (element, type, func) {
          if (element.equals(window) && type !== 'scroll') {
            element = window.document;
          }
          else if (element.isHTMLElementWrapper) {
            element = element.get();
          }

          element.detachEvent("on" + type, func);
        }
      }
    }()),

    /*--------------------------------------------------------------------------
     * @methode argumentsAdd
     * @param args:Arguments
     */
    _argsAdd: function (args) {
      var o = {
        // element
        // event
        config: {},
        scope: null
      };

      switch (args.length) {
        case 3:
          o.element = args[0];
          o.type = args[1];
          o.func = args[2];
          o.config = {};
          o.scope = null;
          break;
        case 4:
          o.element = args[0];
          o.type = args[1];
          if (jsx.type.isFunction(args[2])) {
            o.func = args[2];
            o.config = args[3];
          }
          else {
            o.scope = args[2];
            o.func = args[3];
          }
          break;
        case 5:
          o.element = args[0];
          o.type = args[1];
          o.scope = args[2];
          o.func = args[3];
          o.config = jsx.type.norm(args[4], {});
          break;
        default:
          throw new Error("Wrong parameters for Listener.add!");
      }

      if (typeof o.element === 'string') {
        var elementId = o.element;
        o.element = $id(elementId);
        if (o.element === null) {
          throw new Error("Element with id '" + elementId + "' not found!");
        }
      }

      if (jsx.gui && ( o.element instanceof jsx.gui.Gui || o.element instanceof jsx.gui.XElement)) {
        o.element = o.element.element;
      }

      if (o.element.isHTMLElementWrapper) {
        o.element = o.element.get();
      }

      o.type = jsx.Listener._aliasMap[o.type] ? this._aliasMap[o.type] : o.type;

      return o;
    }
  });

(function () {
  // Internet Explorer
  var ie = !!(window.attachEvent && !window.opera);
  // WebKit
  var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
  // Fifefox
  var ff = !ie && !wk && document.addEventListener;

  if (ff) {
    document.addEventListener('DOMContentLoaded', jsx.Listener._onDomReady, false);
  }

  if (ie) {
    (function () {
      var execute = false;
      try {
        document.documentElement.doScroll('left');
        execute = true;
      }
      catch (e) {
        setTimeout(arguments.callee, 10);
      }

      if (execute) jsx.Listener._onDomReady();

    })();
  }

  if (wk) {
    (function () {
      if (/^(loaded|complete)$/.test(d.readyState)) {
        jsx.Listener._onDomReady();
      }
      else {
        setTimeout(arguments.callee, 10);
      }
    })();
  }

})();

execute(function () {
  var l = jsx.Listener;

  l.RETURN_KEY = 'returnKey';
  l.ESC_KEY = 'escKey';
  l.PASTE = 'paste';
  l.CLICK = 'click';
  l.CUT = 'cut';
  l.DOUBLE_CLICK = 'doubleClick';

  l.DOUBLE_CLICK_TIMESPAN = 300; // in millisecons

  l._typeMap = {};
  l._typeMap[l.RETURN_KEY] = 'keydown';
  l._typeMap[l.ESC_KEY] = 'keydown';
  l._typeMap[l.DOUBLE_CLICK] = 'dblclick';

  l._aliasMap = {};
  l._aliasMap['dblclick'] = l.DOUBLE_CLICK;

  if (jsx.env.ua.ff) {
    l._typeMap['mousewheel'] = 'DOMMouseScroll';
  }

});

