'use strict';

/**
 * The Smartflow application controller.
 *
 * todo - Introduce dependencies in a actionWithRequests
 * todo - The URLs should be found in global settings in the controller.
 *
 * @constructor
 */
function SmartflowApplication() {
  this.STATUS_NOT_STARTED = 0;
  this.STATUS_RUNNING = 1;
  this.STATUS_SUCCESS = 2;
  this.STATUS_FAILED = -1;
  this.STATUS_HALTED = -2;
  this._actionStatus = this.STATUS_NOT_STARTED;
  this._actionInterval = null;
  this._action = null;
  this._actionQueue = [];
  this.startAction = function(action) {
    //console.info('SmartflowApplication: Adding ', action, this._actionQueue);
    this._actionQueue.push(action);
    this._runQueuedActions();
  };
  this._runQueuedActions = function() {
    if (this._actionQueue.length > 0) {
      //console.info('SmartflowApplication: Run ', this._action);
      this._action = this._actionQueue.shift();
      let tmp = this._action;
      this._action.runAction();

      if (Array.isArray(this._action._smartflowActions) && this._action._smartflowActions.length > 0) {
        let self = this;
        let actions = this._action._smartflowActions;
        for (let x = 0; x < actions.length; x++) {
          let a = actions[x];
          a._actionStatus = self.STATUS_NOT_STARTED;
        }
        this._actionInterval = setInterval(function() {
          self._runNotCompleted(tmp);
        }, 1000);
        this._actionStatus = this.STATUS_RUNNING;
      } else {
        this.fireSuccess();
      }
    } else {
      //console.info('SmartflowApplication: No actions in queue');
    }
  };
  this.fireSuccess = function() {
    console.info("fireActionSuccess: ", this._action);
    this._action = null;
  };
  this.fireFailed = function() {
    console.info("fireActionFailed: ", this._action);
    this._action = null;
  };

  this.fireRequestSuccess = function(request) {
    console.info("fireRequestSuccess: ", request);
  };
  this.fireRequestFailed = function(request) {
    console.info("fireRequestFailed: ", request);
  };
  this._runNotCompleted = function(act) {
    // var actions = this._action._smartflowActions;
    let actions = act._smartflowActions;
    let max = actions.length;
    let remaining = 0;
    let failed = 0;
    for (var x = 0; x < max; x++) {
      var a = actions[x];
      failed += (a._actionStatus === this.STATUS_FAILED ? 1 : 0);
      remaining += (a._actionStatus === this.STATUS_NOT_STARTED ? 1 : 0);
    }
    if (remaining === 0) {
      clearInterval(this._actionInterval);
      this.fireSuccess();
    } else if (failed > 0) {
      clearInterval(this._actionInterval);
      this.fireFailed();
    } else {
      for (var z = 0; z < max; z++) {
        var a2 = actions[z];
        if (a2._actionStatus === this.STATUS_NOT_STARTED) {
          a2._actionStatus = this.STATUS_RUNNING;
          a2.connect(this);
        }
      }
    }
  };
}


function SmartflowRequest(url) {
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
  this.connect = function(app) {
    let self = this;
    this._smartflowApp = app;
    this._request = new XMLHttpRequest();
    this._request.onreadystatechange = function() {
      if (this.readyState === self.READY_STATE_UNSENT) {
        self.status(self.readyState);
      } else if (this.readyState === self.READY_STATE_OPENED) {
        self.status(self.readyState);
      } else if (this.readyState === self.READY_STATE_HEADERS_RECEIVED) {
        self.status(self.readyState);
      } else if (this.readyState === self.READY_STATE_LOADING) {
        self.status(self.readyState);
      } else if (this.readyState === self.READY_STATE_DONE) {
        let statusCode = parseInt(this.status);

        if (statusCode >= self.HTTP_INFO && statusCode < self.HTTP_SUCCESS) {
          // information

        } else if (statusCode >= self.HTTP_SUCCESS && statusCode < self.HTTP_REDIRECT) {
          // success
          let contentType = this.getResponseHeader('content-type');
          if (contentType === '') {
            self._smartflowApp.fireRequestSuccess(self._request, this.response);
            self.onSuccess(this.response);
          } else if (contentType.indexOf('json') > -1) {
            self.onSuccess(JSON.parse(this.response));
          } else if (contentType.indexOf('xml') > -1) {
            self.onSuccess(this.responseXML);
          } else {
            self.onSuccess(this.response);
          }
        } else if (statusCode >= self.HTTP_REDIRECT && statusCode < self.HTTP_CLIENT_ERROR) {
          // redirect
          self.onError(statusCode);
        } else if (statusCode >= self.HTTP_CLIENT_ERROR && statusCode < self.HTTP_ERROR) {
          // client error
          self.onError(statusCode);
        } else if (statusCode >= self.HTTP_ERROR && statusCode < self.HTTP_UNKNOWN) {
          // error
          self.onError(statusCode);
        }
      }
    };
    this._request.open('GET', self._url, true);
    this._request.send();
  };
  this.onError = function(response) {
    this._smartflowResponse = response;
  };
  this.onSuccess = function(response) {
    this._smartflowResponse = response;
  };
  this.status = function(status){
    this._smartflowStatus = status;
  }
}

/**
 *
 * @param name
 * @constructor
 */
function SmartflowAction() {
  this._smartflowActions = [];
  this.addRequest = function(request) {
    this._smartflowActions.push(request);
  };
  this.runAction = function () {
    //console.info('SmartflowAction: ', this);
  };
}


module.exports = {
  'SmartflowApplication' : SmartflowApplication,
  'SmartflowAction' : SmartflowAction,
  'SmartflowRequest' : SmartflowRequest,
};
