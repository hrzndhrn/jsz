script({name: 'lib.jsz.log'}, function () {

  // The log-object to hold the log-functions.
  window.log = {};

  var expectedFuncitons = [
    'log', 'debug', 'info', 'warn', 'exception', 'assert', 'dir', 'dirxml',
    'trace', 'group', 'groupCollapsed', 'groupEnd', 'profile', 'profileEnd',
    'count', 'clear', 'time', 'timeEnd', 'timeStamp', 'table', 'error'
  ];
  
  var stackFunctions = [
    'log', 'debug', 'info'
  ];


  if ( window.console !== undefined) {
    createLog();
  }
  else {
    createLogNoop();
  }

  function createLog() {

    switch(_jsz_.log.type) {
      case 'console':
        createLogConsole();
        break;
      case 'stack':
        createLogStack();
        break;
      case 'noop':
        createLogNoop();
        break;
      default:
        throw new Error('Can not create log of type ' + _jsz_.log.type + '!');
    }
  }

  function createLogConsole() {
    window.log = console;
    expectedFuncitons.forEach( function( functionName) {
      if ( window.console[functionName] === undefined) {
        window.log[functionName] = noop;
      }
    });
  }

  function createLogStack() {
    // TODO: Experiment: log with error.stack
    console.warn('log.type.stack is just an experiment for now.');
    expectedFuncitons.forEach( function( functionName) {
      if ( stackFunctions.contains(functionName)) {
        window.log[functionName] = function() {
          var args = Array.fromArguments(arguments);
          var stack = (new Error()).stack;
          console.log(functionName + ': ' + args.join(', ') + '\n' + stack);
        }
      }
      else if ( window.console[functionName] !== undefined) {
        window.log[functionName] = function() {
          console[functionName].apply( console, arguments);
        }
      }
      else {
        window.log[functionName] = noop;
      }
    });
    log.debug('createLogStack ready');
    log.warn('createLogStack ready');
  }

  function createLogNoop() {
    expectedFuncitons.forEach( function( functionName) {
      window.log[functionName] = noop;
    });
  }

});
