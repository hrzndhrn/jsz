script({
  require: ['lib/jsz/core/Namespace.js']
}, function () {

  namespace("jsz").proto("HTMLElement", {

    HTMLElement: function (element, companion) {
      this._element = jsz.norm(element, null)
      this._companion = jsz.norm(companion, null);
    },

    map: function( fun, args) {
      var result = null;
      if ( this.isNotEmpty()) {
        result = apply(fun, this._element, args);
      }

      return result;
    },

    isEmpty: function () {
      return this._element === null;
    },

    isNotEmpty: function() {
      return this._element !== null;
    },

    get: function () {
      return this._element;
    },

    getId: function() {
      return this.map( HTMLElement.prototype.getAttribute, ['id']);
    },

    setStyle: function (style, value) {
      this.map( jsz.dom.setStyle, [style, value]);
    },

    hasType: function() {
      return Boolean(
        this.map( HTMLElement.prototype.hasAttribute, ['type'])
      ).valueOf();
    },

    isType: function( type) {
      return this.hasType()
        && type.equalIgnoreCase( this.getType());
    },

    getType: function() {
      this.map( HTMLElement.prototype.getAttribute, ['type']);
    },

    getCssClasses: function() {
      return this.map(
        HTMLElement.prototype.getAttribute, ['class']).split(JSZ.BLANK);
    },

    addCssClass: function( cssClass) {
      var cssClasses = this.getCssClasses();
      cssClasses.push( cssClass);
      this.map(
        HTMLElement.prototype.setAttribute, ['class',
          cssClasses.join(JSZ.BLANK)]
      );
    },

    removeCssClass: function( cssClass) {
      var cssClasses = this.getCssClasses();
      this.map(
        HTMLElement.prototype.setAttribute, ['class',
          cssClasses.filter(isNotEqual(cssClass)).join(JSZ.BLANK)]
      );
    },

    toggleCssClass: function( cssClassA, cssClassB) {
      if ( jsz.isArray(cssClassA)) {
        cssClassB = cssClassA[1];
        cssClassA = cssClassA[0];
      }

      var cssClasses = this.getCssClasses(),
        removeCssClass,
        addCssClass;

      if ( cssClasses.contains(cssClassB)) {
        addCssClass = cssClassA;
        removeCssClass = cssClassB;
      }
      else {
        addCssClass = cssClassB;
        removeCssClass = cssClassA;
      }

      cssClasses.push( addCssClass);
      this.map(
        HTMLElement.prototype.setAttribute, ['class',
          cssClasses.filter(isNotEqual(removeCssClass)).join(JSZ.BLANK)]
      );
    },

    /** Adds an event listener of type click to the element.
     */
    onClick: function( fun, scope, config) {
      return jsz.Listener.add( this, 'click', fun, scope, config);
    }

  });

  jsz.HTMLElement.create = function(element) {
    return new jsz.HTMLElement( element);
  }

});

