namespace("jsx").Prototype('EventWrapper', {

  EventWrapper: function (event) {
    this.event = event;
    this.companion = null;

    var target = event.target ? event.target : event.srcElement;
    if (target === window || target === window.document) {
      // this.target = target;
      this.target = new jsx.HTMLElementWrapper();
    }
    else {
      this.target = $id(target);
    }
  },

  avoidDefault: function () {
    if (this.event.preventDefault) {
      this.event.preventDefault();
    } else {
      this.event.returnValue = false;
    }
  },

  avoidPropagation: function () {
    if (this.event.stopPropagation) {
      this.event.stopPropagation();
    } else {
      this.event.cancelBubble = true;
    }
  },

  getAltKey: function () {
    return this.event.altKey;
  },

  getShiftKey: function () {
    return this.event.shiftKey;
  },

  getCtrlKey: function () {
    return this.event.ctrlKey;
  },

  getKeyCode: function () {
    return this.event.keyCode;
  },

  isKeyCode: function (keyCode) {
    var isKeyCode;

    if (arguments.length === 1) {
      isKeyCode = this.event.keyCode === keyCode;
    }
    else {
      isKeyCode = Array.args(arguments).some(function (keyCode) {
        return this.event.keyCode === keyCode;
      }, this);
    }

    return isKeyCode;
  },

  getPageX: function () {
    if (typeof this.event.pageX !== 'undefined') {
      return this.event.pageX;
    }
    return this.event.clientX + this._getScroll()[0];
  },

  getPageY: function () {
    if (typeof this.event.pageY !== 'undefined') {
      return this.event.pageY;
    }
    return this.event.clientY + this._getScroll()[1];
  },

  getPageXY: function () {
    return [this.getPageX(), this.getPageY()];
  },

  _getScroll: function () {
    var dd = document.documentElement, db = document.body;
    if (dd && (dd.scrollTop || dd.scrollLeft)) {
      // return [dd.scrollTop, dd.scrollLeft];
      return [dd.scrollLeft, dd.scrollTop];
    } else if (db) {
      // return [db.scrollTop, db.scrollLeft];
      return [db.scrollLeft, db.scrollTop];
    } else {
      return [0, 0];
    }
  },

  getElementX: function () {
    var elementX = null;

    if (this.target.isFull) {
      elementX = this.getPageX() - this.target.positionX()
    }

    return elementX;
  },

  getElementY: function () {
    var elementX = null;

    if (this.target.isFull) {
      elementX = this.getPageY() - this.target.positionY()
    }

    return elementX;
  },

  getWheelDelta: function () {
    if (jsx.env.ua.ff) {
      return function () {
        return this.event.detail
      };
    }
    else {
      return function () {
        return Math.round(this.event.wheelDelta / 120) * -1;
      }
    }
  }(),

  isEventWrapper: true

});

/* --- legacy -------------------------------------------------------------------------------------------------
 getElementX: function() {
 if ( !this.target) return null;
 var pos = jsx.dom.position( this.target);
 return this.getPageX() - pos[0];
 },

 getElementY: function() {
 if ( !this.target) return null;
 var pos = jsx.dom.position( this.target);
 return this.getPageY() - pos[1];
 },

 getElementXY: function() {
 if ( !this.target) return null;
 var pos = jsx.dom.position( this.target);
 return [  this.getPageX() - pos[0], this.getPageY() - pos[1]];
 },

 getPageXY: function() {
 return [ this.getPageX(), this.getPageY()];
 },



 ------------------------------------------------------------------------------------------------------------ */
