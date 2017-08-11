'use strict';
/**
 * Smartflow features
 *
 * - performing actions
 * - altering states with actions
 * - internationalization
 * - detecting user language
 * - default language
 * - configuration of urls
 * - automatic show and hide views
 * - web requests are done with actions declarative
 * - TODO - enable local storage
 * - TODO - create action events: fromCtrl, duration, path, states
 * - TODO - documentation tool available
 * - no dependencies!
 *
 * @constructor
 */
function Smartflow(){
  this._controller = undefined;
  this._controllers = [];
  this._actionQueue = [];
  this._locales = [];
  // Config
  this.setConfig = function(config){
    this._config = config;
  };
  this.getRequestURL = function(action){
    var key = action.constructor.name;
    var val = this._config[ key ];
    if (val === undefined) {
      return action.smartflow.request.url;
    } else {
      return val;
    }
  };
  //Locale
  this.setDefaultLocale = function(locale){
    this._localeDefault = locale;
  };
  this.loadLanguage = function(locale, data){
    this._locales[ locale ] = data;
  };
  this.setLocale = function(locale){
    this._locale = locale;
    this._formatter.config = this._locales[ this._locale ];
  };
  this.autoDetectLocale = function(){
    var l = this.findClosestLocale();
    this.setLocale(l === undefined ? this._localeDefault : l);

  };
  this.findClosestLocale = function(){
    var arr = navigator.languages;
    for (var x=0; x<arr.length; x++) {
      var locale = arr[ x ];
      var language = locale.indexOf("-") > -1 ? locale : locale.split("-")[0];
      if (this._locales[ language ] !== undefined){
        return language;
      }
    }
    return undefined;
  };
  //
  this.REQUEST_TIMEOUT = 3000;
  // Status codes
  this.HTTP_INFO = 100;
  this.HTTP_SUCCESS = 200;
  this.HTTP_REDIRECT = 300;
  this.HTTP_CLIENT_ERROR = 400;
  this.HTTP_ERROR = 500;
  this.HTTP_UNKNOWN = 600;
  // XMLHttpRequest
  this.READY_STATE_UNSENT = 0;
  this.READY_STATE_OPENED = 1;
  this.READY_STATE_HEADERS_RECEIVED = 2;
  this.READY_STATE_LOADING = 3;
  this.READY_STATE_DONE = 4;
  //
  this._states = [];
  this._formatter = new SmartflowFormatter({});
  this.start = function(){
    this.autoDetectLocale();
    for (var x=0; x<this._controllers.length; x++) {
      var ctrl = this._controllers[ x ];
      ctrl.viewInitialized(this._formatter);
    }
    var anchor = window.location.hash;
    var path = anchor.indexOf("#") == 0 ? anchor.substr(1) : "/";
    this.setPath( path );
  };
  this.addController = function(ctrl){
    this._controllers.push(ctrl);
    var self = this;
    ctrl.runAction = function(action){
      self.runAction(action, ctrl);
    };
  };
  this.runAction = function(action, callerCtrl) {
    action._smartflowCaller = callerCtrl;
    this._actionQueue.push(action);
    this._runRemainingActions();
  };
  this._runRemainingActions = function(){
    if (this._action != undefined) {
      return;
    }
    var action = this._actionQueue.shift();
    if (action == undefined) {
      return;
    }
    this._action = action;
    if (action.smartflow) {
      if (action.smartflow.request) {
        // Run with request
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState === self.READY_STATE_UNSENT) {
          } else if (this.readyState === self.READY_STATE_OPENED) {
          } else if (this.readyState === self.READY_STATE_HEADERS_RECEIVED) {
          } else if (this.readyState === self.READY_STATE_LOADING) {
          } else if (this.readyState === self.READY_STATE_DONE){
            var statusCode = parseInt(this.status);
            var contentType = this.getResponseHeader('content-type');
            var data = null;

            if (contentType === 'json') {
              data = JSON.parse(this.response);
            } else if (contentType === 'xml'){
              data = this.responseXML;
            } else {
              data = this.response;
            }

            if (statusCode >= self.HTTP_INFO && statusCode < self.HTTP_SUCCESS) {
              // Information

            } else if (statusCode === self.HTTP_SUCCESS) {
              // Success
              self._fireStateChanged(action.smartflow.state, data);
              self.setPath(action.smartflow.path);
              self._fireActionPerformed(action);

            } else if (statusCode >= self.HTTP_REDIRECT && statusCode < self.HTTP_CLIENT_ERROR) {
              // Redirect
              self._fireStateChanged(action.smartflow.error.state, "Error: Server responded " + statusCode + " (" + action.constructor.name + ")");
              self.setPath(action.smartflow.error.path);
              self._fireActionPerformed(action);

            } else if (statusCode >= self.HTTP_CLIENT_ERROR && statusCode < self.HTTP_ERROR) {
              // Client error
              self._fireStateChanged(action.smartflow.error.state, "Error: Server responded " + statusCode + " (" + action.constructor.name + ") ");
              self.setPath(action.smartflow.error.path);
              self._fireActionPerformed(action);

            } else if (statusCode >= self.HTTP_ERROR && statusCode < self.HTTP_UNKNOWN) {
              // Server error
              self._fireStateChanged(action.smartflow.error.state, "Error: Server responded " + statusCode + " (" + action.constructor.name + ")  ");
              self.setPath(action.smartflow.error.path);
              self._fireActionPerformed(action);
            }
          }
        };
        xhr.timeout = self.REQUEST_TIMEOUT;
        xhr.ontimeout = function(evt) {
          // XMLHttpRequest timed out
          self._fireStateChanged(action.smartflow.error.state, "Error: Timeout " + self.REQUEST_TIMEOUT + " ms for (" + action.constructor.name + ")");
          self.setPath(action.smartflow.error.path);
          self._fireActionPerformed(action);
        };

        var url = self.getRequestURL(action);
        if (url == undefined){
          self._fireStateChanged(action.smartflow.error.state, "Error: URL not specified for (" + action.constructor.name + ")");
          self.setPath(action.smartflow.error.path);
          self._fireActionPerformed(action);
        } else {
          xhr.open( action.smartflow.request.method, url, true  );
          xhr.send();
        }

      } else {
        // Run without request
        if (action.runAction){
          action.runAction();
        }

        var obj = action.smartflow.states;
        for(var key in obj){
          this._fireStateChanged(key, obj[key]);
        }

        this.setPath(action.smartflow.path);
        this._fireActionPerformed(action);
      }
    } else {
      //console.error("App: invalid action ", action);
    }
  };
  this.setPath = function(path){
    if (this._controller && this._controller.smartflow.path === path){
      return;
    }
    this._controller = undefined;
    window.location.href = "#" + path;
    this._firePathChanged(path);
  };
  this._setControllerVisible = function(ctrl, isVisible){
    document.getElementById(ctrl.constructor.name).style.display = isVisible ? "block" : "none";
  };
  this._firePathChanged = function(path){
    for (var x=0; x<this._controllers.length; x++) {
      var ctrl = this._controllers[ x ];
      if (ctrl.smartflow.path !== path) {
        ctrl.viewDisabled();
        this._setControllerVisible(ctrl, false);
      }
    }
    for (var x=0; x<this._controllers.length; x++) {
      var ctrl = this._controllers[ x ];
      if (ctrl.smartflow.path === path) {
        this._controller = ctrl;
        ctrl.viewEnabled();
        this._setControllerVisible(ctrl, true);
      }
    }
  };
  this._fireActionPerformed = function(action){
    var ctrl = action._smartflowCaller;
    action._smartflowCaller = undefined;
    this._action = undefined;
    ctrl.actionPerformed(action);
    this._runRemainingActions();
  };
  this._fireStateChanged = function(state, value){
    if (value == undefined || value == null) {
      delete( this._states[ state ] );
    } else {
      this._states[state] = value;
    }
    for (var x=0; x<this._controllers.length; x++) {
      var ctrl = this._controllers[ x ];
      if (ctrl.stateChanged) {
        ctrl.stateChanged( state, value );
      }
    }
  };
}

function SmartflowFormatter(config){
  this.config = config;
  this.format = function(key, keys){
    var value = this.config[ key ];
    if (value == undefined){
      return "???" + key + "???";
    }

    if (keys == undefined) {
      return value;
    }

    var arr = [];
    if (Array.isArray(keys)){
      arr = keys;
    } else {
      arr[ 0 ] = keys;
    }

    var s = value;
    for (var x = 0; x < arr.length; x++){
      var symbol = "{" + x + "}";
      s = s.replace( symbol, arr[x] );
    }
    return s;
  };
}

module.exports = {
  'App' : Smartflow
};
