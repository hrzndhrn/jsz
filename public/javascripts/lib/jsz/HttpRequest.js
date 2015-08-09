/**
 * This file contains jsz.HttpRequest a wrapper for XMLHttpRequest and the $http
 * module with shortcuts for jsz.Http.
 */
script({
  name: 'lib.jsz.Http'
}, function () {
  'use strict';

  /**
   * The class jsz.HttpRequest a wrapper for XMLHttpRequest.
   */
  namespace('jsz').class('HttpRequest').def({

    /**
     *
     * @param config
     */
    HttpRequest: function (config) {
      this.id = uid('HTTP');
      this._transactionId = null;
      this._method = jsz.default(config.method, 'POST');
      this._user = jsz.default(config.user, JSZ.EMPTY_STRING);
      this._password = jsz.default(config.password, JSZ.EMPTY_STRING);
      this._uri = jsz.default(config.uri, JSZ.EMPTY_STRING);
      this._async = jsz.default(config.async, true);
      this._dataType = jsz.default(config.dataType, 'json');
      this._onSuccess = unite(
        jsz.default(config.onSuccess, noop), config.scope);
      this._onFailure = unite(
        jsz.default(config.onFailure, noop), config.scope);
      this._data = config.data;
      this._request = null;
    },

    send: function( data) {
      if ( this._request !== null) {
        throw new Error('HttpRequest already send!');
      }

      data = jsz.default(data, this._data);

      this._request = this._newRequest();

      this._request.open(
        this._method, this._uri, this._async, this._user, this._password);

      Object.keys(jsz.Http.DEFAULT_HEADER).forEach(function(key){
        this._request.setRequestHeader(key, jsz.Http.DEFAULT_HEADER[key]);
      }, this);

      this._request.send( this._prepareData(data));

      return this;
    },

    onSuccess: function(fn, scope) {
      this._onSuccess = unite(fn, scope);
    },

    _prepareData: function(data) {
      var preparedData;

      if ( this._dataType === jsz.Http.JSON) {
        preparedData = JSON.stringify(data);
      }

      return preparedData;
    },

    _newRequest: function() {
      this._transactionId = this.id + ':' + uid('TA');

      var request = new XMLHttpRequest();
      request.onreadystatechange =
        this._getResponseListener( this._transactionId);

      jsz.Http.transactions[this._transactionId] = this;

      return request;
    },

    _getResponseListener: function(transactionId) {
      return function() {
        console.log(this);
        if ( this.readyState === XMLHttpRequest.DONE ) {
          // jsz.Http._onResponseDone(transactionId, this);
          jsz.Http.transactions[transactionId]._onResponseDone(this);
          delete jsz.Http.transactions[transactionId];

        }
      };
    },

    _onResponseDone: function(request) {
      if(request.status === jsz.Http.OK) {
        this._onResponseSuccess(request);
      }
      else {
        this._onResponesFailure(request);
      }
    },

    _onResponseSuccess: function(request) {
      var data;

      if (this._dataType === jsz.Http.JSON) {
        data = JSON.parse(request.responseText);
      }

      this._onSuccess(data);
    },

    _onResponseFailure: function(response) {

    }

  }).static({

    transactions: {},

    DEFAULT_HEADER: {
      'Content-Type'    : 'application/json;charset=utf-8',
      'charset'         : 'utf-8',
      'X-Requested-With': 'XMLHttpRequest',
      'X-JSX-Version'   : '0.1'
    },

    JSON: 'json',

    OK: 200


  });

  /**
   * The $http module contains some shortcuts for jsz.Http
   */
  module('$http').def({

    post: function(config) {
      return (new jsz.HttpRequest(config)).send();
    }
  });

});

