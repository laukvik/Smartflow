'use strict';

function Smartflow(){
  this._controller = undefined;
  this._controllers = [];
  this.start = function(){
    for (var x=0; x<this._controllers.length; x++) {
      var ctrl = this._controllers[ x ];
      ctrl.viewInitialized(this);
    }
    var anchor = window.location.hash;
    var path = anchor.indexOf("#") == 0 ? anchor.substr(1) : "/";
    this.setPath( path );
  };
  this.addController = function(ctrl){
    ctrl._smartflowID = ctrl.constructor.name;
    this._controllers.push(ctrl);
    var self = this;
    ctrl.runAction = function(action){
      self.runAction(action, ctrl);
    };
  };
  this.runAction = function(action, callerCtrl){
    if (action.smartflow) {
      if (action.smartflow.request) {
        // Run with request
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4){
            var statusCode = parseInt(this.status);
            if (statusCode == 200) {
              action.smartflow.value = this.response;
              action.smartflow.path = action.smartflow.success;
              self._fireStateChanged(action.smartflow.state, action.smartflow.value);
              self.setPath(action.smartflow.path);
              self._fireActionPerformed(action, callerCtrl);
            } else {
              action.smartflow.value = undefined;
              action.smartflow.path = action.smartflow.error;
              self.setPath(action.smartflow.path);
              self._fireActionPerformed(action, callerCtrl);
            }
          }
        };
        xhr.open( 'GET', action.smartflow.request.url, true  );
        xhr.send();

      } else {
        // Run without request
        if (action.runAction){
          action.runAction();
        }
        this._fireStateChanged(action.smartflow.state, action.smartflow.value);
        this.setPath(action.smartflow.path);
        this._fireActionPerformed(action, callerCtrl);
      }
    } else {
      console.error("App: invalid action ", action);
    }
  };
  this.setPath = function(path){
    this._controller = undefined;
    window.location.href = "#" + path;
    for (var x=0; x<this._controllers.length; x++) {
      var ctrl = this._controllers[ x ];
      if (ctrl.smartflow.path === path) {
        this._controller = ctrl;
        ctrl.viewEnabled();
      } else {
        ctrl.viewDisabled();
      }
    }
  };
  this._fireActionPerformed = function(action, ctrl){
    ctrl.actionPerformed(action);
  };
  this._fireStateChanged = function(state, value){
    for (var x=0; x<this._controllers.length; x++) {
      var ctrl = this._controllers[ x ];
      if (ctrl.stateChanged) {
        ctrl.stateChanged( state, value );
      }
    }
  };
}

module.exports = {
  'Smartflow' : Smartflow
};
