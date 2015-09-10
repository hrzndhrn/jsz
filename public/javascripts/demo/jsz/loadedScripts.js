script({
  name:'demo.jsz.loadedScripts',
  onReadyState: READY_STATE.COMPLETE
}, function () {
  'use strict';

  $id('scripts').html(
    Object.keys(script.map).reduce(function(string, name){
      return string + name + '<br>';
    }, JSZ.EMPTY_STRING)
  );

});
