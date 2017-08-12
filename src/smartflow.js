'use strict';
/**
 * Smartflow features
 *
 * - performing actions
 * - supports calling multiple request
 * - altering states with actions
 * - internationalization
 * - detecting user language
 * - default language
 * - configuration of urls
 * - automatic show and hide views
 * - web requests are done with actions declarative
 * - TODO - enable local storage
 * - TODO - documentation tool available
 * - TODO - add support for deep paths /inbox/{states.folderID}
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
  this.addView = function(ctrl){
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

    // Event object
    var actionEvent = {
      "action": {
        "name": action.constructor.name,
        "value": action.smartflow
      },
      "states": {},
      "error": undefined,
      "request": {
        "method": undefined,
        "url": undefined
      },
      "response": {
        "status": undefined,
        "body": undefined,
        "contentType": undefined,
      },
      "path": undefined,
      "from": this._path,
      "start": Date.now(),
      "finish": undefined
    };

    //
    action._smartflowStarted = new Date();
    if (action.smartflow) {
      if (action.smartflow.request) {
        // Run with request
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState === self.READY_STATE_DONE){
            var statusCode = parseInt(this.status);
            actionEvent.response.status = statusCode;
            var contentType = this.getResponseHeader('content-type');
            actionEvent.response.contentType = contentType;

            if (contentType === 'json') {
              actionEvent.response.body = JSON.parse(this.response);
            } else if (contentType === 'xml'){
              actionEvent.response.body = this.responseXML;
            } else {
              actionEvent.response.body = this.response;
            }

            if (statusCode >= self.HTTP_INFO && statusCode < self.HTTP_SUCCESS) {
              // Information

            } else if (statusCode === self.HTTP_SUCCESS) {
              // Success
              actionEvent.path = action.smartflow.path;
              actionEvent.states[ action.smartflow.state ] = actionEvent.response.body;
              delete (actionEvent.error);
              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= self.HTTP_REDIRECT && statusCode < self.HTTP_CLIENT_ERROR) {
              // Redirect
              var errorRedirectMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ")";
              actionEvent.path = action.smartflow.error.path;
              actionEvent.error = errorRedirectMessage;
              actionEvent.states[ action.smartflow.error.state ] = errorRedirectMessage;
              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= self.HTTP_CLIENT_ERROR && statusCode < self.HTTP_ERROR) {
              // Client error
              var errorClientMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ") ";
              actionEvent.path = action.smartflow.error.path;
              actionEvent.error = errorClientMessage;
              actionEvent.states[ action.smartflow.error.state ] = errorClientMessage;
              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= self.HTTP_ERROR && statusCode < self.HTTP_UNKNOWN) {
              // Server error
              var errorServerMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ")  ";
              actionEvent.path = action.smartflow.error.path;
              actionEvent.error = errorServerMessage;
              actionEvent.states[ action.smartflow.error.state ] = errorServerMessage;
              self._fireActionPerformed(action, actionEvent);
            }
          }
        };
        xhr.timeout = self.REQUEST_TIMEOUT;
        xhr.ontimeout = function(evt) {
          // XMLHttpRequest timed out
          var errorTimeoutMessage = "Error: Timeout " + self.REQUEST_TIMEOUT + " ms for (" + action.constructor.name + ")";
          actionEvent.error = errorTimeoutMessage;
          actionEvent.states[ action.smartflow.error.state ] = errorTimeoutMessage;
          self._fireActionPerformed(action, actionEvent);
        };

        var url = self.getRequestURL(action);
        if (url === undefined){
          var errorUrlMessage = "Error: URL not specified for (" + action.constructor.name + ")";
          actionEvent.error = errorUrlMessage;
          actionEvent.states[ action.smartflow.error.state ] = errorUrlMessage;
          self._fireActionPerformed(action, actionEvent);
        } else {
          actionEvent.request.method = action.smartflow.request.method;
          actionEvent.request.url = url;
          xhr.open( action.smartflow.request.method, url, true  );
          xhr.send();
        }

      } else {
        // Run without request
        delete (actionEvent.error);
        if (action.runAction){
          action.runAction();
        }
        actionEvent.path = action.smartflow.path;
        delete (actionEvent.request);
        delete (actionEvent.response);
        actionEvent.states = action.smartflow.states === undefined ? {} : action.smartflow.states;
        this._fireActionPerformed( action, actionEvent );
      }
    } else {
      //console.error("App: invalid action ", action);
    }
  };

  this._fireActionPerformed = function(action, actionEvent) {
    actionEvent.finish = Date.now();
    for(var key in actionEvent.states){
      this._fireStateChanged(key, actionEvent.states[key]);
    }
    this.setPath(actionEvent.path);
    action._smartflowStarted = undefined;
    var ctrl = action._smartflowCaller;
    action._smartflowCaller = undefined;
    this._action = undefined;
    ctrl.actionPerformed(actionEvent);
    this._runRemainingActions();
  };
  this.setPath = function(path){
    if (this._controller && this._controller.smartflow.path === path){
      return;
    }
    this._path = path;
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

  this._fireStateChanged = function(state, value){
    if (value === undefined || value == null) {
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
    if (value === undefined){
      return "???" + key + "???";
    }
    if (keys === undefined) {
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
