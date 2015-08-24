script({
  name: 'test.jsz.util.format.percent',
  require: [
    'lib.jsz.util.format',
    'lib.jsz.unit',
    'lib.jsz.log'
  ]
}, function () {
  'use strict';

  jsz.unit.Session.get('jsz.util').add(
    new jsz.unit.TestCase({
      name: 'percent: type=d',
      setup: function() {
        this.assert = jsz.unit.assert;
      },
      methods: {
        flags: function() {
          this.assert.isEqual('<%%d>: <%d>'.format(3), '<%d>: <3>');
          this.assert.isEqual('<%%d>: <%d>'.format(-3), '<%d>: <-3>');
          this.assert.isEqual('<%% d>: <% d>'.format(3), '<% d>: < 3>');
          this.assert.isEqual('<%% d>: <% d>'.format(-3), '<% d>: <-3>');
          this.assert.isEqual('<%%0d>: <%0d>'.format(3), '<%0d>: <3>');
          this.assert.isEqual('<%%0d>: <%0d>'.format(-3), '<%0d>: <-3>');
          this.assert.isEqual('<%%#d>: <%#d>'.format(3), '<%#d>: <3>');
          this.assert.isEqual('<%%#d>: <%#d>'.format(-3), '<%#d>: <-3>');
          this.assert.isEqual('<%%+d>: <%+d>'.format(3), '<%+d>: <+3>');
          this.assert.isEqual('<%%+d>: <%+d>'.format(-3), '<%+d>: <-3>');
          this.assert.isEqual('<%%-d>: <%-d>'.format(3), '<%-d>: <3>');
          this.assert.isEqual('<%%-d>: <%-d>'.format(-3), '<%-d>: <-3>');
        },

        flagsWidth: function() {
          this.assert.isEqual('<%%6d>: <%6d>'.format(3), '<%6d>: <     3>');
          this.assert.isEqual('<%%6d>: <%6d>'.format(-3), '<%6d>: <    -3>');
          this.assert.isEqual('<%% 6d>: <% 6d>'.format(3), '<% 6d>: <     3>');
          this.assert.isEqual('<%% 6d>: <% 6d>'.format(-3), '<% 6d>: <    -3>');
          this.assert.isEqual('<%%06d>: <%06d>'.format(3), '<%06d>: <000003>');
          this.assert.isEqual('<%%06d>: <%06d>'.format(-3), '<%06d>: <-00003>');
          this.assert.isEqual('<%%#6d>: <%#6d>'.format(3), '<%#6d>: <     3>');
          this.assert.isEqual('<%%#6d>: <%#6d>'.format(-3), '<%#6d>: <    -3>');
          this.assert.isEqual('<%%+6d>: <%+6d>'.format(3), '<%+6d>: <    +3>');
          this.assert.isEqual('<%%+6d>: <%+6d>'.format(-3), '<%+6d>: <    -3>');
          this.assert.isEqual('<%%-6d>: <%-6d>'.format(3), '<%-6d>: <3     >');
          this.assert.isEqual('<%%-6d>: <%-6d>'.format(-3), '<%-6d>: <-3    >');
        },

        flagsWidthPrecision: function() {
          this.assert.isEqual('<%%9.2d>: <%9.2d>'.format(3),
            '<%9.2d>: <       03>');
          this.assert.isEqual('<%%9.2d>: <%9.2d>'.format(-3),
            '<%9.2d>: <      -03>');
          this.assert.isEqual('<%% 9.2d>: <% 9.2d>'.format(3),
            '<% 9.2d>: <       03>');
          this.assert.isEqual('<%% 9.2d>: <% 9.2d>'.format(-3),
            '<% 9.2d>: <      -03>');
          this.assert.isEqual('<%%09.2d>: <%09.2d>'.format(3),
            '<%09.2d>: <       03>');
          this.assert.isEqual('<%%09.2d>: <%09.2d>'.format(-3),
            '<%09.2d>: <      -03>');
          this.assert.isEqual('<%%#9.2d>: <%#9.2d>'.format(3),
            '<%#9.2d>: <       03>');
          this.assert.isEqual('<%%#9.2d>: <%#9.2d>'.format(-3),
            '<%#9.2d>: <      -03>');
          this.assert.isEqual('<%%+9.2d>: <%+9.2d>'.format(3),
            '<%+9.2d>: <      +03>');
          this.assert.isEqual('<%%+9.2d>: <%+9.2d>'.format(-3),
            '<%+9.2d>: <      -03>');
        }
      }

    })
  );

});
