/**
 *
 *
 * Hierarchy:
 *
 * Application
 *   - State
 *     - stateChanged (event: name, value)
 * - Controller
 *   - Action
 *     - runAction (method)
 *     - actionCompleted (event: name, object)
 * - View
 *   - viewChanged (event: name)
 *
 *
 * @constructor
 */

'use strict';

function Smartflow (){

    this._controllers = [];
    this._states = [];
    this._view = undefined;
    this._actionController = undefined;
    this._actionQueue = [];
    this._actionPlayer = undefined;

    // View stuff
    this.addView = function(controller) {
        this._controllers.push(controller);
        return controller;
    };

    this.removeView = function(controller) {
        var index = this._controllers.indexOf(controller);
        this._controllers.splice(index, 1);
    };

    this._setViewVisibility = function(viewName, isVisible) {
        document.getElementById(viewName).className = isVisible ? "application-view visible" : "application-view hidden";
    };

    this.setView = function(viewName, viewID) {
        if (viewName === this._view) {
            return;
        }
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            // Hide exising
            if (this._view === ctrl.constructor.name) {
                if (typeof ctrl.viewDisabled === "function") {
                    ctrl.viewDisabled(this);
                }
                this._setViewVisibility(this._view, false);
            }
        }
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            // Show new
            if (viewName === ctrl.constructor.name) {
                if (typeof ctrl.viewEnabled === "function") {
                    ctrl.viewEnabled(this);
                }
                this._view = viewName;
                this._setViewVisibility(this._view, true);
                this.setRoute(viewName, viewID);
            }
        }
    };

    // Action
    this.startAction = function(action){
        // console.info("ApplicationModel.startAction", action);
        var list = new ActionList();
        action.runAction(this, list);
        action._actionList = list;
        if (list._actions.length > 0) {
            list._actionContainer = action;
            this._actionPlayer = new ActionPlayer(this);
            this._actionPlayer.startAction(action);
        }
    };

    this.actionSuccess = function(action) {
        // console.debug("ApplicationModel.success", action);
        if (typeof action.actionSuccess == "function") {
            action.actionSuccess(this);
        }
    };

    this.actionFailed = function(action) {
        // console.debug("ApplicationModel.failed", action);
        if (typeof action.actionFailed == "function") {
            action.actionFailed(this);
        }
    };

    // State
    this._fireStateChanged = function(state, value, oldValue) {
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            ctrl.stateChanged({name: state, value: value, oldValue: oldValue});
        }
    };

    this.setState = function(state, value){
        var oldValue = this._states[state];
        this._states[state] = value;
        this._fireStateChanged(state, value, oldValue);
    };

    this.getState = function(state) {
        return this._states[state];
    };

    // Routing
    this.readRoute = function() {
        var anchor = document.location.hash;
        if (anchor !== "") {
            var arr = anchor.split("/");
            var view = arr[1];
            var id = arr[2];
            // console.debug(view, id);
            this.setView(view, id);
        }
    };

    this.setRoute = function(viewName, viewID) {
        if (viewName !== "") {
            window.location.href = "#/" + viewName + (viewID === undefined ? "" : "/" + viewID);
        }
    };

    this.startApplication = function() {
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            if (typeof ctrl.viewInitialized === "function") {
                ctrl.viewInitialized(this);
            }
        }
    };
}

function ActionList(){

    this._actions = [];
    this._names = [];
    this._dependencies = [];

    this.addAction = function(action, name, dependencies) {
        action._actionName = name;
        action._actionDependencies = dependencies;
        this._actions.push(action);
    }
}

function ActionPlayer(application){

    this.STATUS_NOT_STARTED = 0;
    this.STATUS_RUNNING     = 1;
    this.STATUS_SUCCESS     = 2;
    this.STATUS_FAILED      = -1;
    this.STATUS_HALTED      = -2;

    this._application = application;
    this._actionStatus = this.STATUS_NOT_STARTED;
    this._actionInterval = undefined;
    this._action = undefined;

    this.startAction = function(action) {
        this._action = action;
        var self = this;
        var actions = this._action._actionList._actions;
        for (var x = 0; x < actions.length; x++) {
            var a = actions[x];
            a._actionStatus = self.STATUS_NOT_STARTED;
        }
        this._actionInterval = setInterval(function () {
            self._runNotCompleted();
        }, 1000);
        this._actionStatus = this.STATUS_RUNNING;
    };

    this.fireSuccess = function() {
        this._application.actionSuccess(this._action);
    };

    this.fireFailed = function() {
        this._application.actionFailed(this._action);
    };

    this.actionSuccess = function(action) {
        // console.info("Player.actionSuccess", action);
        action._actionStatus = this.STATUS_SUCCESS;
    };

    this.actionFailed = function(action) {
        // console.info("Player.actionFailed", action);
        action._actionStatus = this.STATUS_FAILED;
    };

    this._getActionByName = function(actionName) {
        var arr = this._action._actionList._actions;
        for (var x = 0; x < arr.length; x++) {
            var a = arr[x];
            if (a._actionName === actionName) {
                return a;
            }
        }
        return null;
    };

    this._runNotCompleted = function() {
        var actions = this._action._actionList._actions;
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
                    // Check dependencies
                    var depArray = a._actionDependencies;
                    if (Array.isArray(depArray) && depArray.length > 0) {
                        // Dependencies
                        var missingDependency = false;
                        for (var y = 0; y < depArray.length; y++) {
                            var dependantActionName = depArray[y];
                            var dependantAction = this._getActionByName(dependantActionName);
                            if (dependantAction._actionStatus !== this.STATUS_SUCCESS) {
                                missingDependency = true;
                            }
                        }
                        if (missingDependency === false) {
                            a._actionStatus = this.STATUS_RUNNING;
                            a.runAction(this);
                        }
                    } else {
                        // No dependencies
                        a._actionStatus = this.STATUS_RUNNING;
                        a.runAction(this);
                    }
                }
            }
        }
    };

}
