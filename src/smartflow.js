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
 * todo State must be connected to {appID}-{userIdentity}-{stateName}
 *
 * @constructor
 */

'use strict';

function Smartflow (main){
    this._login = {};
    this._path = [];
    this._states = [];
    this._statesType = [];
    this._statesDescription = [];
    this._statesPersistence = [];
    this._main = main;
    this._controllers = [];
    this._view = undefined;
    this._dialogs = [];
    this._actionController = undefined;
    this._actionQueue = [];
    this._actionPlayer = undefined;
    //
    //
    // Dialogs
    //
    //
    this.addDialog = function(dialog, name){
        this._dialogs[ name ] = dialog;
        dialog._dialogName = name;
        if (typeof dialog.dialogInitialized === "function") {
            dialog.dialogInitialized(this);
        }
    };
    this.openDialog = function(name, features) {
        if (this._dialog){
            console.info("Smartflow: A dialog is already open: ", this._dialog );
            return;
        }
        this._dialog = name;
        this._dialogs[ name ].dialogEnabled(features);
        this._main.dialogEnabled(name, features);
    };
    this.closeDialog = function(answer) {
        this._dialogs[ this._dialog ].dialogDisabled(answer);
        this._main.dialogDisabled(answer);
        this._dialog = undefined;
    };
    //
    //
    // Login
    //
    //
    this.setLogin = function(login){
        this._login = login;
        this._main.loginChanged( this._login );
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            if (typeof ctrl.loginChanged === "function") {
                ctrl.loginChanged( this._login );
            }
        }
    };
    this.logout = function(){
        this.setLogin();
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
        this._languages[ isoLanguage ] = translation;
    };
    this._language = undefined;
    this.setLanguage = function(isoLanguage){
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
    /**
     * Adds a named controller and maps it to a path.
     *
     * @param controller
     * @param viewName
     * @param viewPath
     * @param states an array of states to subscribe to
     * @returns {*}
     */
    this.addView = function(controller, viewName, viewPath, states) {
        controller._view = viewName;
        controller._path = viewPath;
        controller._states = Array.isArray(states) ? states : [];
        this._controllers.push(controller);
        if (typeof controller.viewInitialized === "function") {
            controller.viewInitialized(this);
        }
    };

    this.removeView = function(controller) {
        var index = this._controllers.indexOf(controller);
        controller._view = undefined;
        controller._path = undefined;
        controller._states = undefined;
        this._controllers.splice(index, 1);
    };

    this.setView = function(viewName) {
        if (this._view && viewName !== this._view){
            this._main.viewDisabled(this._view);
        }
        if (viewName === this._view) {
            for (var x = 0; x < this._controllers.length; x++) {
                var ctrl = this._controllers[x];
                if (typeof ctrl.pathChanged === "function") {
                    ctrl.pathChanged(this._path);
                }
            }
            //return;
        }
        // Hide old
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];

            if (this._view === ctrl.constructor.name) {
                if (typeof ctrl.viewDisabled === "function") {
                    ctrl.viewDisabled(this);
                }
            }
        }
        // Show new
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            // Show new
            if (viewName === ctrl._view) {
                if (typeof ctrl.viewEnabled === "function") {
                    ctrl.viewEnabled(this);
                }
                this._view = viewName;
                //window.location.href = "#" + ctrl._path;
            }
        }
        this._main.viewEnabled(viewName);
    };

    this.setPath = function( path ){
        console.info("Smartflow:setPath: ", path);
        if (path == "" || path == null || typeof path == "undefined" || path == "/") {
            this._path = [];
        } else {
            this._path = path.substr(1).split("/");
        }
        var str = this._path.length == 0 ? "/" : "/" + this._path[ 0 ];
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            if (ctrl._path == str) {
                this.setView(ctrl._view);
            }
        }
        window.location.href = "#" + path;
        this._main.pathChanged(this._path);
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
    this._fireStateChanged = function(state, value) {
        var stateData = {"name": state, "value": value};
        if (typeof this._main.stateChanged == "function") {
            this._main.stateChanged( stateData );
        }
        for (var x = 0; x < this._controllers.length; x++) {
            var ctrl = this._controllers[x];
            if (typeof ctrl.stateChanged == "function") {
                if (Array.isArray(ctrl._states)) {
                    if (ctrl._states.indexOf(state) > -1){
                        ctrl.stateChanged( stateData );
                    }
                }
            }
        }
    };
    this.setState = function(state, value, skipPersistence){
        var stateType = this._statesType[ state ];
        if (stateType === "Array") {
            // todo Add type checking of state types
        }
        this._states[state] = value;
        if (this._statesPersistence[ state ] === true) {
            // This is required to not re-trigger state persistence
            // when reading from persisting
            console.info("Persisting: ", state, value);
            localStorage.setItem(state, value);
        }
        this._fireStateChanged(state, value);
    };
    this.registerArray = function(name, initialValue, description, persistence){
        this._registerState(name, initialValue, "Array", description, persistence);
    };
    this.registerJson = function(name, initialValue, description, persistence){
        this._registerState(name, initialValue, "Json", description, persistence);
    };
    this.registerString = function(name, initialValue, description, persistence){
        this._registerState(name, initialValue, "String", description, persistence);
    };
    this.registerNumber = function(name, initialValue, description, persistence){
        this._registerState(name, initialValue, "Number", description, persistence);
    };
    this.registerDate = function(name, initialValue, description, persistence){
        this._registerState(name, initialValue, "Date", description, persistence);
    };
    this.registerObject = function(name, initialValue, description, persistence){
        this._registerState(name, initialValue, "Object", description, persistence);
    };
    this._registerState = function(name, initialValue, dataType, description, persistence){
        this._states[ name ] = initialValue;
        this._statesType[ name ] = dataType;
        this._statesDescription[ name ] = description;
        this._statesPersistence[ name ] = persistence;

        if (persistence === true) {
            this._states[ name ] = localStorage.getItem(name);
        }

        this._fireStateChanged(name, initialValue);
    };
    //
    //
    // Main
    //
    //
    this.startApplication = function() {
        var anchor = window.location.hash;
        var path = anchor.indexOf("#") == 0 ? anchor.substr(1) : "/";
        this.setPath( path );
        this._main.startApplication();
    };

    this.displayDocumentation = function(){
        // Supported languages, missing keys and default language
        var langHtml = "";
        // State - names, types, persistence
        var stateHtml = "";
        // Views -
        var viewsHtml = "";
        // Paths -
        var pathHtml = "";
        // Main -
        var mainHtml = "";
        return langHtml + stateHtml + viewsHtml + pathHtml + mainHtml;
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

