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

    string: function () {
      var args = Array.from(arguments);
      var string = args.shift();

      var formatTokens = this._getFormatTokens(string);

      return this._format(formatTokens, args);
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
      log.error('_formatPercent: Not implemented yet!');
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
      var tokens = this._split(string, this._WHITE_SPACE);
      tokens = this._split(tokens, this._PERCENT_SIGN);
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
    return jsz.util.format.string.apply(jsz.util.format, args);
  };

});