/**
 * Smartflow
 *
 * Controller events:
 * - viewInitialized
 * - viewEnabled
 * - viewDisabled
 * - pathChanged
 * - languageChanged
 * - loginChanged
 * - actionStarted
 * - actionSuccess
 * - actionFailed
 *
 * @constructor
 */

'use strict';

function Smartflow (){
    this._loggedIn = false;
    this._path = [];
    this._controllers = [];
    this._states = [];
    this._view = undefined;
    this._actionController = undefined;
    this._actionQueue = [];
    this._actionPlayer = undefined;
    //
    //
    // Login
    //
    //
    this.setLoggedIn = function(isLoggedIn){
        this._loggedIn = isLoggedIn == "true";
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            if (typeof ctrl.loginChanged === "function") {
                ctrl.loginChanged( isLoggedIn );
            }
        }
    };
    //
    //
    // Environment
    //
    //
    this._developmentMode = false;
    this.setDevelopmentMode = function(isDevelopmentMode){
        this._developmentMode = isDevelopmentMode;
    };
    this.isDevelopmentMode = function(){
        return this._developmentMode;
    };
    //
    //
    // Language stuff
    //
    //
    this._languages = {};
    this.listLanguages = function(){
        return this._languages;
    };
    this.loadLanguage = function(isoLanguage, translation){
        console.info("Smartflow.loadLanguage: ", isoLanguage, translation);
        this._languages[ isoLanguage ] = translation;
    }
    this._language = undefined;
    this.setLanguage = function(isoLanguage){
        console.info("Smartflow.setLanguage: ", isoLanguage);
        if (this._language == isoLanguage){
            return;
        }
        this._language = isoLanguage;
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            if (typeof ctrl.languageChanged === "function") {
                ctrl.languageChanged( isoLanguage );
            }
        }
    };
    this.translate = function(languageKey, keys){
        var translation = this._languages[ this._language ];
        var value = translation[ languageKey ];
        var arr = [];
        if (typeof keys === "String") {
            arr[ 0 ] = keys;
        } else if (Array.isArray(keys)){
            arr = keys;
        }
        if (!value) {
            return "???" + languageKey + "???";
        } else {
            var s = value;
            for (var x = 0; x < arr.length; x++){
                var symbol = "{" + x + "}";
                s = s.replace( symbol, arr[x] );
            }
            return s;
        }
    };

    //
    //
    // Formats
    //
    //
    this._formatNumber = "";
    this.formatNumber = function(value){
        return value;
    };
    this._formatDate = "DD.MM.YYYY";
    this.formatDate = function(value){
        return value;
    };
    this._formatTime = "hh:mm:ss";
    this.formatTime = function(value){
        return value;
    };

    //
    //
    // View stuff
    //
    //
    this.addView = function(controller, viewName, viewPath) {
        controller._view = viewName;
        controller._path = viewPath;
        this._controllers.push(controller);
        return controller;
    };

    this.removeView = function(controller) {
        var index = this._controllers.indexOf(controller);
        controller._view = undefined;
        controller._path = undefined;
        this._controllers.splice(index, 1);
    };

    this._setViewVisibility = function(viewName, isVisible) {
        document.getElementById(viewName).style.display = isVisible ? "block" : "none";
    };

    this.setView = function(viewName) {
        if (viewName === this._view) {
            //console.info("Smartflow.setView: ", this._view);
            for (var x = 0; x < this._controllers.length; x++) {
                var ctrl = this._controllers[x];
                if (typeof ctrl.pathChanged === "function") {
                    ctrl.pathChanged(this);
                }
            }

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
            if (viewName === ctrl._view) {
                if (typeof ctrl.viewEnabled === "function") {
                    ctrl.viewEnabled(this);
                }
                this._view = viewName;
                this._setViewVisibility(this._view, true);
                window.location.href = "#" + ctrl._path;
            }
        }
    };

    this.setPath = function( path ){
        if (path == "" || path == null || typeof path == "undefined" || path == "/") {
            this._path = [];
        } else {
            this._path = path.substr(1).split("/");
        }
        var str = this._path.length == 0 ? "/" : "/" + this._path[ 0 ];
        console.info("SetPath: ", this._path, str);
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];

            if (ctrl._path == str) {
                this.setView(ctrl._view);
            }

        }
    };
    this.getPath = function(){
        return this._path;
    };

    //
    //
    // Action stuff
    //
    //
    this.startAction = function(action){
        // console.info("Smartflow.startAction", action);
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
    //
    //
    // State
    //
    //
    this._fireStateChanged = function(state, value, oldValue) {
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            if (typeof ctrl.stateChanged == "function") {
                ctrl.stateChanged({name: state, value: value, oldValue: oldValue});
            }
        }
    };

    this._getBindingElement = function(state){
        var attributeName = 'data-smartflow-state="'+ state + '"';
        return document.querySelector("[" + attributeName + "]");
    };
    this.setState = function(state, value){
        var oldValue = this._states[state];
        this._states[state] = value;
        this._fireStateChanged(state, value, oldValue);
    };
    this.getState = function(state) {
        return this._states[state];
    };


    this.startApplication = function() {
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            if (typeof ctrl.viewInitialized === "function") {
                ctrl.viewInitialized(this);
            }
        }
        var anchor = window.location.hash;
        var path = anchor.indexOf("#") == 0 ? anchor.substr(1) : "/";
        console.info("Smartflow.startApplication: ", path);
        this.setPath( path );
    };
}

/**
 * ActionList
 *
 *
 * @constructor
 */
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

/**
 * ActionPlayer
 *
 *
 * @param application
 * @constructor
 */
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

