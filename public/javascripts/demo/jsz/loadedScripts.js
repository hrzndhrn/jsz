script({name:'demo.jsz.loadedScripts'}, function () {
  'use strict';

  $id('scripts').html(
    Object.keys(script.map).reduce(function(string, name){
      return string + name + '<br>';
    }, JSZ.EMPTY_STRING)
  );

});
