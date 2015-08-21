script({
  name: 'demo.lightsOut',
  require: ['lib.jsz.util.random']
}, function () {
  'use strict';

  /**
   * An object for lights-out
   */
  window.lightsOut = object( function () { // The object constructor.
    // Get all lights or get all HTML elements with the class light.
    this._lights = $$('.light');

    // Add a click listener to all lights.
    this._lights.onClick(this._onClick, this, {
      returnType: 'element' // Call the event listener with the target as
                            // as argument.
    });

    this.newGame();

  },{

    /** The size of the game board. */
    _gameBoardSize: Object.freeze({
      width: 5, height: 5
    }),

    _lights: null,

    newGame: function() {
      // Set randomly the one of the classes on or off to the lights.
      this._lights.forEach(function (element) {
        element.addCssClass(jsz.util.random.array(['on', 'off']));
      }, this);
    },

    /**
     * This function will be called by a click on a light.
     * @param element - The element that was clicked.
     * @private
     */
    _onClick: function (element) {
      // Get neighbours of the clicked element and toggle lights for them.
      // The list contains also the clicked element.
      this._neighbours(this._lights.indexOf(element)).forEach(
        this._toogleLight, this);
    },

    /**
     * Toggle a light by his index.
     * @param index
     * @private
     */
    _toogleLight: function (index) {
      this._lights.get(index).toggleCssClass('on', 'off');
    },

    /**
     * Get a list of án element with all neighbours.
     * @param index - The index of the main element.
     * @returns {Array}
     * @private
     */
    _neighbours: function (index) {
      // change index to coordinate
      var coordinate = this._index2coordinate(index);

      // make a list of the light coordinates including the main coordinate.
      var coordinates = [
        {x: coordinate.x - 1, y: coordinate.y},
        {x: coordinate.x + 1, y: coordinate.y},
        {x: coordinate.x, y: coordinate.y - 1},
        {x: coordinate.x, y: coordinate.y + 1},
        coordinate
      ];

      return coordinates
        .filter(this._validCoordinate, this) // filter invalid coordinates
        .map(this._coordinate2index, this);  // convert coordinate to indexes
    },

    /**
     * The function _validCoordinate returns true if the coordinate on the
     * game board.
     *
     * @param coordinate
     * @returns {boolean}
     * @private
     */
    _validCoordinate: function (coordinate) {
      return coordinate.x >= 0 && coordinate.y >= 0 &&
        coordinate.x < this._gameBoardSize.width &&
        coordinate.y < this._gameBoardSize.height;
    },

    /**
     * Converts a index to coordinate on the game board.
     *
     * @param index
     * @returns {{x: number, y: number}}
     * @private
     */
    _index2coordinate: function (index) {
      var xCoordinate = index % this._gameBoardSize.width;
      return {
        x: xCoordinate,
        y: (index - xCoordinate) / this._gameBoardSize.width
      };
    },

    /**
     * Converts a game board coordinate to an index.
     *
     * @param coordinate
     * @returns {*}
     * @private
     */
    _coordinate2index: function (coordinate) {
      return coordinate.y * this._gameBoardSize.width + coordinate.x;
    }
  });
});
