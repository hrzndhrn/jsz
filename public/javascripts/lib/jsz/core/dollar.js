//TODO: Documentation
script( {
    require: [
        'lib/jsz/core/Array.js',
        'lib/jsz/core/HTMLElement.js',
        'lib/jsz/core/HTMLElementsList.js'
    ]
}, function() {

$id = function(id) {
    return new jsz.HTMLElement(document.getElementById(id));
};

$ = function( selectors, element) {
    if (element === undefined) {
        element = document;
    }

    return new jsz.HTMLElement(element.querySelector(selectors));
};

$$ = function( selectors, element) {
    if (element === undefined) {
        element = document;
    }

    return new jsz.HTMLElementsList(
        Array.fromNodeList(element.querySelectorAll(selectors))
          .map( jsz.HTMLElement.create)
    );
};

});