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

function Smartflow (main, id){
    this._main = main;
    this._main._smartflowID = id;
    this._login = {};
    this._path = [];
    this._states = [];
    this._statesType = [];
    this._statesDescription = [];
    this._statesPersistence = [];
    this._statesInitial = [];
    this._controllers = [];
    this._view = undefined;
    this._dialogs = [];
    this._tutorials = [];
    this._tutorialDescriptions = [];
    this._tutorialsTimer = [];
    this._actionController = undefined;
    this._actionQueue = [];
    this._actionPlayer = undefined;
    //
    //
    // Tutorial
    //
    //
    this.addTutorial = function(tutorial, description){
        this._tutorials[ tutorial ] = tutorial;
        this._tutorialDescriptions[ tutorial ] = description;
    };
    this.playTutorial = function(tutorialName){

        var self = this;
        this._tutorialsTimer[ tutorialName ] = setInterval(function(){

            console.info("Starting: ", self._tutorialsTimer[ tutorialName ] );

            var el = document.getElementById(tutorialName);
            el.style.display = "block";
            var stepIndex = el.getAttribute("data-step-id");
            if (!stepIndex || isNaN(stepIndex)){
                stepIndex = 0;
            } else {
                stepIndex = parseInt(stepIndex);
            }

            var stepsArr = el.querySelectorAll(".tutorial-step");
            if (stepIndex > 0){
                var targetID = stepsArr[stepIndex-1].getAttribute("data-target-id");
                var target = document.getElementById( targetID );
                target.setAttribute("data-tutorial-focus", "no");
                stepsArr[ stepIndex-1 ].style.display = "none";
            }

            if (stepIndex > stepsArr.length - 1){
                el.style.display = "none";
                clearInterval( self._tutorialsTimer[ tutorialName ] );
                el.removeAttribute("data-step-id");
                console.info("Stopping: ", self._tutorialsTimer[ tutorialName ] );
            } else {
                el.setAttribute("data-step-id", stepIndex + 1);

                var step = stepsArr[ stepIndex ];
                step.style.display = "block";

                var targetID = step.getAttribute("data-target-id");
                var target = document.getElementById( targetID );
                target.setAttribute("data-tutorial-focus", "yes");

                var r = target.getBoundingClientRect();
                el.style.position = "absolute";
                el.style.left = (r.right + 10) + "px";
                el.style.top = r.top + "px";
            }

        }, 1000);

    };
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
            console.warn("Smartflow: A dialog is already open: ", this._dialog );
            return;
        }
        this._dialog = name;
        this._dialogs[ name ].dialogEnabled(features);
        this._main.dialogEnabled(name, features);
    };
    this.updateDialog = function(features) {
        this._dialogs[ this._dialog ].dialogChanged(features);
        this._main.dialogChanged(features);
    };
    this.closeDialog = function(answer) {
        this._dialogs[ this._dialog ].dialogDisabled(answer);
        this._main.dialogDisabled(this._dialog, answer);
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
            // TODO - Add type checking of state types
        }
        this._states[state] = value;
        if (this._statesPersistence[ state ] === true) {
            // This is required to not re-trigger state persistence
            // when reading from persisting
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
        this._statesInitial[ name ] = initialValue;

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
        var self = this;
        // Supported languages, missing keys and default language
        var langHtml = "";
        Object.keys(this._languages).forEach(function(lang,index) {
            var langPack = self._languages[ lang ];
            langHtml += '<tr><td>'+lang+'</td><td>'+ Object.keys(langPack).length +'</td></tr>';
        });
        langHtml = '<h2>Languages</h2><table border="1"><thead><tr><th>Language</th><th>Keys</th></tr></thead><tbody>'+langHtml + '</tbody></table>';

        // State - names, types, persistence
        var stateHtml = "";
        Object.keys(this._states).forEach(function(stateName,index) {
            var stateType = self._statesType[ stateName ];
            var statesDescription = self._statesDescription[ stateName ];
            var statesPersistence = self._statesPersistence[ stateName ];
            var statesInitial = self._statesInitial[ stateName ];
            stateHtml += '<tr><td>'+ stateName +'</td><td>'+ (statesPersistence ? "Yes":"No") +'</td><td>'+ JSON.stringify(statesInitial) +'</td><td>'+ statesDescription +'</td></tr>';
        });
        stateHtml = '<h2>States</h2><table border="1"><thead><tr><th>State</th><th>Persistent</th><th>Initial</th><th>Description</th></thead><tbody>' + stateHtml + '</tbody></table>';

        console.info(self._controllers[0]);

        // Views -
        var viewsHtml = "";
        for (var x=0; x<this._controllers.length; x++){
            var view = this._controllers[ x ];
            var viewName = view._view;
            var viewPath = view._path;
            var viewStates = view._states;
            var viewClass = view.constructor.name;
            viewsHtml += '<tr><td>'+viewName+'</td><td>'+ viewClass +'</td><td>'+viewPath+'</td><td>'+ JSON.stringify(viewStates) +'</td></tr>';
        }
        viewsHtml = '<h2>Views</h2><table border="1"><thead><tr><th>Name</th><th>Function</th><th>Path</th><th>State</th></tr></thead><tbody>'+viewsHtml + '</tbody></table>';


        // Dialogs -
        var dialogHtml = "";
        Object.keys(this._dialogs).forEach(function(dialog, index) {
            dialogHtml += '<tr><td>'+ dialog +'</td><td>'+ dialog.constructor +'</td></tr>';
        });
        dialogHtml = '<h2>Dialogs</h2><table border="1"><thead><tr><th>Name</th><th>Function</th></tr></thead><tbody>' + dialogHtml + '</tbody></table>';

        // App
        var mainHtml = "";
        mainHtml += '<tr><td>'+ this._main._smartflowID +'</td><td>'+ this._main.constructor.name +'</td></tr>';

        mainHtml = '<h2>Application</h2><table border="1"><thead><tr><th>Name</th><th>Function</th></tr></thead><tbody>' + mainHtml + '</tbody></table>';


        // Tutorial -
        var tutorialHtml = "";
        Object.keys(this._tutorials).forEach(function(tutorial, index) {
            var desc = self._tutorialDescriptions[ tutorial ];
            tutorialHtml += '<tr><td>'+ tutorial +'</td><td>'+ desc +'</td></tr>';
        });
        tutorialHtml = '<h2>Tutorials</h2><table border="1"><thead><tr><th>Name</th><th>Function</th></tr></thead><tbody>' + tutorialHtml + '</tbody></table>';


        return mainHtml + viewsHtml + stateHtml + dialogHtml + tutorialHtml + langHtml;
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

