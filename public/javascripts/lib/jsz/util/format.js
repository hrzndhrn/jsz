script({name: 'lib.jsz.util.format'}, function () {
  'use strict';

  namespace('jsz.util').module('format').def({

    _regExpString: {
      whiteSpace: '\\s+',
      percentSign: '%%',
      dollarSign: '\\$\\$',
      percentPlaceholder: '\\x25.*?[csdf]',
      dollarPlaceholder: '\\$[0-9|a-z|A-Z]*'
    },
    
    _TEXT: 'text',
    _WHITE_SPACE: 'whiteSpace',
    _PERCENT_SIGN: 'percentSign',
    _DOLLAR_SIGN: 'dollarSign',
    _PERCENT_PLACEHOLDER: 'percentPlaceholder',
    _DOLLAR_PLACEHOLDER: 'dollarPlaceholder',

    text: function() {
      var args = Array.from(arguments);
      var string = args.shift();

      var formatTokens = this._getFormatTokens(string);

      return this._format(formatTokens, args);
    },

    integer: function(format, value) {
      var string = Math.abs(value).toString(),
        negative = value < 0,
        sign = value < 0 ? '-' : JSZ.EMPTY_STRING;
      log.debug('format: >' + format + '<');

      if (format !== JSZ.EMPTY_STRING) {
        // Format the value.
        var flags = this._percentflags(format);
        var size = this._percentWidthPrecision(format);

        log.dir({flags:flags,size:size});

        if (flags.space && !flags.plus) {
          if (!negative) {
            string = JSZ.BLANK + string;
          }
        }
        if (flags.plus && !negative) {
          sign = '+';
        }

        if ( string.length < size.width) {
          var fillWith = JSZ.BLANK;

          if (flags.zero) {
            fillWith = '0';
          }
          else {
            string = sign + string;
            sign = JSZ.EMPTY_STRING;
          }

          var fill = fillWith.repeat(size.width - string.length - sign.length);

          if ( flags.minus) {
            string = string + fill;
          }
          else {
            string = fill + string;
          }

        }
      }

      string = sign + string;

      return string;
    },

    _percentflags: function(format) {
      return {
        space: /\s/.test(format),
        minus: /-/.test(format),
        plus: /\+/.test(format),
        zero: /^[^d]*0/.test(format),
        hash: /#/.test(format)
      };
    },

    _percentWidthPrecision: function(format) {
      var result = {
        width: 0,
        precision: 0
      };

      var widthPrecision = format.match(/(\d*)\.(\d*)$/);

      if (widthPrecision === null) {
        var width = format.match(/(\d+)$/);
        if (width !== null) {
          result.width = width[1];
        }
      }
      else {
        result.width = widthPrecision[1];
        result.precision = widthPrecision[2];
      }

      return result;
    },

    _format: function(tokens, args) {
      var placeholderIndex = 0,
        string = JSZ.EMPTY_STRING,
        formatted;

      tokens.forEach(function(token) {
        var section;

        if (token.type === this._WHITE_SPACE || token.type === this._TEXT) {
          section = token.content;
        }
        else if (token.type === this._PERCENT_SIGN ||
          token.type === this._DOLLAR_SIGN) {
          section = token.content.substr(0,1);
        }
        else if (token.type === this._PERCENT_PLACEHOLDER) {
          formatted = this._formatPercent(token, args, placeholderIndex);
          section = formatted.content;
          placeholderIndex = formatted.index;
        }
        else if (token.type === this._DOLLAR_PLACEHOLDER) {
          formatted = this._formatDollar(token, args, placeholderIndex);
          section = formatted.content;
          placeholderIndex = formatted.index;
        }

        if (section === undefined) {
          throw new Error('Input string was not in a correct format!');
        }
        else {
          string += section;
        }

      }, this);

      return string;
    },

    _formatPercent: function(token, args, index) {
      log.warn('_formatPercent: Not fully implemented yet');
      var content =  token.content.match(/^.(.*)(.)$/),
        format = content[1],
        type = content[2],
        string = JSZ.EMPTY_STRING,
        position = index;

      var posInFormat = format.match(/^(\d*)\$(.*)$/);
      if (posInFormat === null) {
        index++;
      }
      else {
        position = parseInt(posInFormat[1], 10) - 1;
        format = posInFormat[2];
      }

      if ( type === 'd') {
        string = this.integer(format, args[position]);
      }
      else {
        throw new Error('Can not resolve %' + format + type + '!');
      }

      return {
        content: string,
        index: index
      };
    },

    _formatDollar: function(token, args, index) {
      var string = JSZ.EMPTY_STRING;
      if (token.content === '$') {
        string = args[index];
        index++;
      }
      else if (/\$\d+$/.test(token.content)) {
        string = args[parseInt(token.content.substr(1),10)-1];
      }
      else {
        string = args[0][token.content.substr(1)];
      }

      return {
        content: string,
        index: index
      };
    },

    _getFormatTokens: function(string) {
      // var tokens = this._split(string, this._WHITE_SPACE);
      var tokens = this._split(string, this._PERCENT_SIGN);
      tokens = this._split(tokens, this._DOLLAR_SIGN);
      tokens = this._split(tokens, this._PERCENT_PLACEHOLDER);
      tokens = this._split(tokens, this._DOLLAR_PLACEHOLDER);
      return tokens;
    },

    _split: function(value, type) {
      var array, regExp;

      if (jsz.isString(value)) {
        regExp = new RegExp( '(' + this._regExpString[type] + ')');
        array = value.split(regExp).map(function(content) {
          return {
            content:content,
            type: regExp.test(content) ? type : this._TEXT
          };
        }, this);

      }
      else {
        regExp = new RegExp( '^' + this._regExpString[type] + '$');
        array = value.map(function(token) {
          var result;

          if (token.type === this._TEXT) {
            if (regExp.test(token.content)) {
              token.type = type;
              result = token;
            }
            else {
              result = this._split(token.content, type);
            }
          }
          else {
            result = token;
          }

          return result;
        }, this).flatten();
      }

      return array;
    }

  });

  // Add the format function to the String class
  String.prototype.format = function() {
    var args = Array.from(arguments);
    args.unshift(this.toString());
    return jsz.util.format.text.apply(jsz.util.format, args);
  };

});