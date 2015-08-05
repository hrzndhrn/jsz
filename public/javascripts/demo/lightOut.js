script({
  name: 'demo.lightOuts',
  require: ['lib.jsz.util.random']
}, function () {
  'use strict';

  console.log('jsz - Demo: lightOut.js');

  module('lightOut').def({

    lightsSize: Object.freeze({
      width: 5, height: 5
    }),

    lightOut: function () {
      this.lights = $$('.light');

      this.lights.forEach(function (element) {
        element.addCssClass(jsz.util.random.array(['on', 'off']));
      }, this);

      this.lights.onClick(this._onClick, this, {
        returnType: 'element'
      });

    },

    _onClick: function (element) {
      element.toggleCssClass('on', 'off');
      this._neighbours(
        this.lights.indexOf(element)
      ).forEach(this._toogleLight, this);
    },

    _toogleLight: function (index) {
      this.lights.get(index).toggleCssClass('on', 'off');
    },

    _neighbours: function (index) {
      var coordinate = this._index2coordinate(index);

      var coordinates = [
        {x: coordinate.x - 1, y: coordinate.y},
        {x: coordinate.x + 1, y: coordinate.y},
        {x: coordinate.x, y: coordinate.y - 1},
        {x: coordinate.x, y: coordinate.y + 1}
      ];

      return coordinates
        .filter(this._validCoordinate, this)
        .map(this._coordinate2index, this);
    },

    _validCoordinate: function (coordinate) {
      return coordinate.x >= 0 && coordinate.y >= 0 &&
        coordinate.x < this.lightsSize.width &&
        coordinate.y < this.lightsSize.height;
    },

    _index2coordinate: function (index) {
      var xCoordinate = index % this.lightsSize.width;
      return {
        x: xCoordinate,
        y: (index - xCoordinate) / this.lightsSize.width
      };
    },

    _coordinate2index: function (coordinate) {
      return coordinate.y * this.lightsSize.width + coordinate.x;
    }
  });


});
