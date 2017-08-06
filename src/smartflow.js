/**
 * The Smartflow application controller.
 *
 * todo - Introduce dependencies in a actionWithRequests
 * todo - The URLs should be found in global settings in the controller.
 *
 * @constructor
 */
function SmartflowApplication(){

  this.STATUS_NOT_STARTED = 0;
  this.STATUS_RUNNING     = 1;
  this.STATUS_SUCCESS     = 2;
  this.STATUS_FAILED      = -1;
  this.STATUS_HALTED      = -2;

  this._actionStatus = this.STATUS_NOT_STARTED;
  this._actionInterval = null;
  this._action = null;

  this.startAction = function(action) {
    console.info("SmartflowApplication: Starting ", action);
    this._action = action;
    this._action.runAction();
    if (this._action._smartflowActions.length > 0) {
      var self = this;
      var actions = this._action._smartflowActions;
      for (var x = 0; x < actions.length; x++) {
        var a = actions[x];
        a._actionStatus = self.STATUS_NOT_STARTED;
      }
      this._actionInterval = setInterval(function () {
        self._runNotCompleted();
      }, 1000);
      this._actionStatus = this.STATUS_RUNNING;
    }
  };
  this.fireSuccess = function(){

  };
  this.fireFailed = function(){

  };
  this._runNotCompleted = function() {
    var actions = this._action._smartflowActions;
    var max = actions.length;
    var remaining = 0;
    var failed = 0;
    var success = 0;
    for (var x = 0; x < max; x++) {
      var a = actions[x];
      failed += (a._actionStatus === this.STATUS_FAILED ? 1 : 0);
      remaining += (a._actionStatus === this.STATUS_NOT_STARTED ? 1 : 0);
      success += (a._actionStatus === this.STATUS_SUCCESS ? 1 : 0);
    }
    if (remaining === 0) {
      clearInterval(this._actionInterval);
      this.fireSuccess();
    } else if (failed > 0) {
      clearInterval(this._actionInterval);
      this.fireFailed();
    } else {
      for (var x = 0; x < max; x++) {
        var a = actions[x];
        if (a._actionStatus === this.STATUS_NOT_STARTED) {
            a._actionStatus = this.STATUS_RUNNING;
            a.connect(this);
        }
      }
    }
  };

}


function SmartflowRequest(url){
  this.HTTP_INFO = 100;
  this.HTTP_SUCCESS = 200;
  this.HTTP_REDIRECT = 300;
  this.HTTP_CLIENT_ERROR = 400;
  this.HTTP_ERROR = 500;
  this.HTTP_UNKNOWN = 600;

  this.READY_STATE_UNSENT = 0;
  this.READY_STATE_OPENED = 1;
  this.READY_STATE_HEADERS_RECEIVED = 2;
  this.READY_STATE_LOADING = 3;
  this.READY_STATE_DONE = 4;

  this._url = url;
  this.connect = function(){
    var self = this;

    if (window.XMLHttpRequest) {
      // code for modern browsers
      this._request = new XMLHttpRequest();
    } else {
      // code for old IE browsers
      this._request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    this._request.onreadystatechange = function() {


      if (this.readyState === self.READY_STATE_UNSENT) {

      } else if (this.readyState === self.READY_STATE_OPENED) {

      } else if (this.readyState === self.READY_STATE_HEADERS_RECEIVED) {

      } else if (this.readyState === self.READY_STATE_LOADING) {

      } else if (this.readyState === self.READY_STATE_DONE) {

        var statusCode = parseInt(this.status);

        if (statusCode >= self.HTTP_INFO && statusCode < self.HTTP_SUCCESS) {
          // information

        } else if (statusCode >= self.HTTP_SUCCESS && statusCode < self.HTTP_REDIRECT) {
          // success
          var contentType = this.getResponseHeader('content-type');
          if (contentType === '') {
            self.onSuccess(this.response);
          } else if (contentType.indexOf("json") > -1){
            self.onSuccess( JSON.parse(this.response) );

          } else if (contentType.indexOf("xml") > -1){
            self.onSuccess( this.responseXML );

          } else {
            self.onSuccess(this.response);
          }

        } else if (statusCode >= self.HTTP_REDIRECT && statusCode < self.HTTP_CLIENT_ERROR) {
          // redirect
          self.onError( statusCode );

        } else if (statusCode >= self.HTTP_CLIENT_ERROR && statusCode < self.HTTP_ERROR) {
          // client error
          self.onError( statusCode );

        } else if (statusCode >= self.HTTP_ERROR && statusCode < self.HTTP_UNKNOWN) {
          // error
          self.onError( statusCode );
        }

      }

    };
    this._request.open("GET", self._url, true);
    this._request.send();
  };
  this.onError = function(response){
    console.info("Error: ", response);
  };
  this.onSuccess = function(response){
    console.info("Success: ", response);
  };
}

/**
 *
 * @param name
 * @constructor
 */
function SmartflowAction(name){
  this._smartflowAction = name;
  this._smartflowActions = [];
  this.addRequest = function( request ){
    this._smartflowActions.push( request );
  };
  this.runAction = function(){
    console.info("SmartflowAction: ", this._smartflowAction);
  };
}

// ----------------------------- APP ------------------------------------------

var reqLogin = new SmartflowRequest("/api/login");
var reqCategories = new SmartflowRequest("/api/categories");
var reqAddressbook = new SmartflowRequest("/api/addressbook");
var reqQuote = new SmartflowRequest("/api/quote");


var actionWithRequests = new SmartflowAction();
actionWithRequests.addRequest( reqLogin );
actionWithRequests.addRequest( reqCategories );
actionWithRequests.addRequest( reqAddressbook );
actionWithRequests.addRequest( reqQuote );

//var actionSimple = new SmartflowAction();

var app = new SmartflowApplication();
app.startAction( actionWithRequests );


