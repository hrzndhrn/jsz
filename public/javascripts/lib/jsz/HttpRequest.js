/**
 * This file contains jsz.HttpRequest a wrapper for XMLHttpRequest and the $http
 * module with shortcuts for jsz.HttpRequest.
 */
script({
  name: 'lib.jsz.HttpRequest'
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
      this._onLoading = unite(
        jsz.default(config.onLoading, noop), config.scope);
      this._data = config.data;
      this._request = null;
      this._abortFlag = false;
    },

    send: function( data) {
      if ( this._request !== null) {
        throw new Error('HttpRequest already send!');
      }

      data = jsz.default(data, this._data);

      this._request = this._newRequest();

      this._request.open(
        this._method, this._uri, this._async, this._user, this._password);

      Object.keys(jsz.HttpRequest.DEFAULT_HEADER).forEach(function(key){
        this._request.setRequestHeader(key, jsz.HttpRequest.DEFAULT_HEADER[key]);
      }, this);

      this._request.send( this._prepareData(data));

      return this;
    },

    abort: function() {
      this._abortFlag = true;
      this._request.abort();
    },

    onSuccess: function(fn, scope) {
      this._onSuccess = unite(fn, scope);
      return this;
    },

    _prepareData: function(data) {
      var preparedData;

      if ( this._dataType === jsz.HttpRequest.JSON) {
        preparedData = JSON.stringify(data);
      }

      return preparedData;
    },

    _newRequest: function() {
      var request = new XMLHttpRequest();
      request.onreadystatechange =
        this._getResponseListener( this.id);

      jsz.HttpRequest.transactions[this.id] = this;

      return request;
    },

    _getResponseListener: function(transactionId) {
      var listener;

      if ( jsz.HttpRequest.ON_LOADING === true) {
        listener = function() {
          if (this.readyState === XMLHttpRequest.LOADING) {
            jsz.HttpRequest.transactions[transactionId]._onResponseLoading(this);
          }
          if (this.readyState === XMLHttpRequest.DONE ) {
            jsz.HttpRequest.transactions[transactionId]._onResponseDone(this);
            delete jsz.HttpRequest.transactions[transactionId];
          }
        };
      }
      else {
        listener = function() {
          if (this.readyState === XMLHttpRequest.DONE ) {
            jsz.HttpRequest.transactions[transactionId]._onResponseDone(this);
            delete jsz.HttpRequest.transactions[transactionId];
          }
        };
      }

      return listener;
    },

    _onResponseLoading: function(request) {
      this._onLoading(request);
    },

    _onResponseDone: function(request) {
      if ( this._abortFlag === false) {
        if(request.status === jsz.HttpRequest.OK) {
          this._onResponseSuccess(request);
        }
        else {
          this._onResponseFailure(request);
        }
      }
    },

    _onResponseSuccess: function(request) {
      var data;

      if (this._dataType === jsz.HttpRequest.JSON) {
        if (request.responseText === JSZ.EMPTY_STRING) {
          data = {};
        }
        else {
          data = JSON.parse(request.responseText);
        }
      }

      this._onSuccess(data);
    },

    _onResponseFailure: function(request) {

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

    OK: 200,

    ON_LOADING: false

  });

  /**
   * The $http module contains some shortcuts for jsz.HttpRequest
   */
  module('$http').def({

    post: function(config) {
      return (new jsz.HttpRequest(config)).send();
    }
  });

});

