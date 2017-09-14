import Formatter from "./formatter";
import ComponentBuilder from "./builder";

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
 * - supports deep links
 * - date formatting
 * - no dependencies!
 *
 * @constructor
 */
export default class Smartflow {
  constructor() {
    this._controller = undefined;
    this._controllers = [];
    this._actionQueue = [];
    this._locales = [];
    this._localeDefault = undefined;
    //--------------------------------- Action runner ---------------------------------
    this.REQUEST_TIMEOUT = 3000;

    this._formatter = new Formatter({});

    // Status codes
    const HTTP_STATUS_CODE_INFO = 100;
    const HTTP_STATUS_CODE_SUCCESS = 200;
    const HTTP_STATUS_CODE_REDIRECT = 300;
    const HTTP_STATUS_CODE_CLIENT_ERROR = 400;
    const HTTP_STATUS_CODE_ERROR = 500;
    const HTTP_STATUS_CODE_UNKNOWN = 600;
    // XMLHttpRequest
    const READY_STATE_UNSENT = 0;
    const READY_STATE_OPENED = 1;
    const READY_STATE_HEADERS_RECEIVED = 2;
    const READY_STATE_LOADING = 3;
    const READY_STATE_DONE = 4;
    //
    this._states = [];
  }

  fireComponentChanged(component, property, value, view) {
    var componentEvent = {
      "component": component,
      "property": property,
      "value": value,
      "view": view
    };
    view.componentChanged(componentEvent);
  }

  isAction(action) {
    if (action === undefined) {
      return false;
    } else {
      if (action.constructor) {
        if (action.constructor.name) {
          return true;
        }
      }
    }
    return false;
  }

  //--------------------------------- Config ---------------------------------
  setConfig(config) {
    this._config = config;
  }

  getConfig() {
    return this._config;
  }

  getRequestUrl(action) {
    if (!this.isAction(action)) {
      //console.info("Smartflow: not an action", action);
      return undefined;
    }
    if (this._config === undefined) {
      //console.info("Smartflow: Missing configuration!");
      return undefined;
    }
    var key = action.constructor.name;
    var val = this._config[key];
    if (val === undefined) {
      return action.smartflow.request.url;
    } else {
      return val;
    }
  }

  //--------------------------------- Locale ---------------------------------
  setDefaultLocale(locale) {
    this._localeDefault = locale;
  }

  getDefaultLocale() {
    return this._localeDefault;
  }

  loadLanguage(locale, data) {
    this._locales[locale] = data;
  }

  setLocale(locale) {
    this._locale = locale;
    this._formatter.config = this._locales[this._locale];
  }

  getLocale() {
    return this._locale;
  }

  _autoDetectLocale() {
    var l = this.findClosestLocale(navigator.languages);
    this.setLocale(l === undefined ? this._localeDefault : l);
  };

  findClosestLocale(arr) {
    for (var x = 0; x < arr.length; x++) {
      var locale = arr[x];
      var language = locale.indexOf("-") > -1 ? locale : locale.split("-")[0];
      if (this._locales[language] !== undefined) {
        return language;
      }
    }
    return undefined;
  };

  //--------------------------------- View ----------------------------------------
  isView(ctrl) {
    if (ctrl === undefined) {
      return false;
    }
    if (!ctrl.smartflow) {
      return false;
    }
    if (!ctrl.smartflow.path) {
      return false;
    }
    if (typeof ctrl.smartflow.path !== 'string') {
      return false;
    }
    return true;
  };

  findView(name) {
    if (typeof name !== 'string') {
      return undefined;
    }
    for (var x = 0; x < this._controllers.length; x++) {
      var ctrl = this._controllers[x];
      if (ctrl.constructor.name == name) {
        return ctrl;
      }
    }
    return undefined;
  };

  addView(ctrl) {
    if (!this.isView(ctrl)) {
      return false;
    }
    if (this.findView(ctrl.constructor.name)) {
      return false;
    }
    this._controllers.push(ctrl);
    var self = this;
    ctrl.runSmartflow = function (action) {
      self.runAction(action, ctrl);
    };
    this._buildComponents(ctrl);
    return true;
  };

  _buildComponents(ctrl) {
    // mount components
    if (ctrl.smartflow.components) {
      var builder = new ComponentBuilder(ctrl, this._formatter, this);
      builder.buildComponents();
    }
  };

  removeView(ctrl) {
    if (!this.isView(ctrl)) {
      return false;
    }
    for (var x = 0; x < this._controllers.length; x++) {
      var existCtrl = this._controllers[x];
      if (existCtrl.constructor.name === ctrl.constructor.name) {
        delete this._controllers[x];
        return true;
      }
    }
    return false;
  };

  start() {
    this._autoDetectLocale();
    for (var x = 0; x < this._controllers.length; x++) {
      var ctrl = this._controllers[x];
      ctrl.viewInitialized(this._formatter);
    }
    var anchor = window.location.hash;
    var path = anchor.indexOf("#") == 0 ? anchor.substr(1) : "/";
    this.setPath(path);
  };

  runAction(action, callerCtrl) {
    if (!this.isAction(action)) {
      return false;
    }
    if (!this.isView(callerCtrl)) {
      return false;
    }
    action._smartflowCaller = callerCtrl;
    this._actionQueue.push(action);
    this._runRemainingActions();
    return true;
  };

  _findActionID(action) {
    return action.constructor.name;
  };

  _buildActionEvent(action) {
    return {
      "action": {
        "name": this._findActionID(action),
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
      "params": [],
      "from": this._path,
      "start": Date.now(),
      "finish": undefined,
      "commands": []
    };
  };

  _runRemainingActions() {
    if (this._action !== undefined) {
      return;
    }
    var action = this._actionQueue.shift();
    if (action === undefined) {
      return;
    }
    this._action = action;

    // Event object
    var actionEvent = this._buildActionEvent(action);


    if (!action.smartflow.commands) {
      delete (actionEvent.commands)
    } else {
      actionEvent.commands = action.smartflow.commands;
    }

    //
    action._smartflowStarted = new Date();
    if (action.smartflow) {
      if (action.smartflow.request) {
        // Run with request
        let self = this;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (this.readyState === self.READY_STATE_DONE) {
            let statusCode = parseInt(this.status);
            actionEvent.response.status = statusCode;
            let contentType = this.getResponseHeader('content-type');
            actionEvent.response.contentType = contentType;

            // TODO - Add support for variants of content types eg application/json;utf-8 etc
            if (contentType === 'application/json') {
              actionEvent.response.body = JSON.parse(this.response);
            } else if (contentType === 'application/xml') {
              actionEvent.response.body = this.responseXML;
            } else {
              actionEvent.response.body = this.response;
            }

            if (statusCode >= self.HTTP_STATUS_CODE_INFO && statusCode < self.HTTP_STATUS_CODE_SUCCESS) {
              // Information

            } else if (statusCode === self.HTTP_STATUS_CODE_SUCCESS) {
              // Success
              actionEvent.path = action.smartflow.success.path;
              actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.states[action.smartflow.success.state] = actionEvent.response.body;
              delete (actionEvent.error);

              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= self.HTTP_STATUS_CODE_REDIRECT && statusCode < self.HTTP_STATUS_CODE_CLIENT_ERROR) {
              // Redirect
              let errorRedirectMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ")";
              actionEvent.path = action.smartflow.error.path;
              actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.error = errorRedirectMessage;
              actionEvent.states[action.smartflow.error.state] = errorRedirectMessage;
              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= self.HTTP_STATUS_CODE_CLIENT_ERROR && statusCode < self.HTTP_STATUS_CODE_ERROR) {
              // Client error
              let errorClientMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ") ";
              actionEvent.path = action.smartflow.error.path;
              actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.error = errorClientMessage;
              actionEvent.states[action.smartflow.error.state] = errorClientMessage;
              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= self.HTTP_STATUS_CODE_ERROR && statusCode < self.HTTP_STATUS_CODE_UNKNOWN) {
              // Server error
              let errorServerMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ")  ";
              actionEvent.path = action.smartflow.error.path;
              actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.error = errorServerMessage;
              actionEvent.states[action.smartflow.error.state] = errorServerMessage;
              self._fireActionPerformed(action, actionEvent);
            }
          }
        };
        xhr.timeout = self.REQUEST_TIMEOUT;
        xhr.ontimeout = function () {
          // XMLHttpRequest timed out
          let errorTimeoutMessage = "Error: Timeout " + self.REQUEST_TIMEOUT + " ms for (" + action.constructor.name + ")";
          actionEvent.error = errorTimeoutMessage;
          actionEvent.states[action.smartflow.error.state] = errorTimeoutMessage;
          self._fireActionPerformed(action, actionEvent);
        };

        let url = self.getRequestUrl(action);
        if (url === undefined) {
          let errorUrlMessage = "Error: URL not specified for (" + action.constructor.name + ")";
          actionEvent.error = errorUrlMessage;
          actionEvent.states[action.smartflow.error.state] = errorUrlMessage;
          self._fireActionPerformed(action, actionEvent);
        } else {
          actionEvent.request.method = action.smartflow.request.method;
          actionEvent.request.url = url;
          xhr.open(action.smartflow.request.method, url, true);
          xhr.send();
        }
      } else if (action.smartflow.dialog) {
        //
        // Dialog
        //
        var dialogID = this._findActionID(action);

        let builder = new ComponentBuilder();
        let d = action.smartflow.dialog;
        let html = builder.buildDialog(dialogID, d.title, d.body, d.buttons);
        let el = document.createElement("div");
        el.innerHTML = html;
        document.body.appendChild(el);

        var self = this;

        var stateName = d.state;

        for (let x = 0; x < d.buttons.length; x++) {
          let btn = d.buttons[x];
          let buttonID = dialogID + "__button__" + btn.value;
          document.getElementById(buttonID).addEventListener("click", function () {
            let evt = self._buildActionEvent(action);
            evt.states[stateName] = btn.value;
            delete evt.request;
            delete evt.response;
            delete evt.error;
            evt.path = btn.path;
            self._fireActionPerformed(action, evt);
          });
        }

      } else {
        // Run without request
        delete (actionEvent.error);
        if (action.runAction) {
          action.runAction();
        }
        actionEvent.path = action.smartflow.path;
        if (actionEvent.path) {
          actionEvent.params = this._findParams(actionEvent.path).param;
        }
        delete (actionEvent.request);
        delete (actionEvent.response);
        actionEvent.states = action.smartflow.states === undefined ? {} : action.smartflow.states;
        actionEvent.addStates = action.smartflow.addStates === undefined ? {} : action.smartflow.addStates;
        actionEvent.removeStates = action.smartflow.removeStates === undefined ? {} : action.smartflow.removeStates;

        this._fireActionPerformed(action, actionEvent);
      }
    } else {
      //console.error("App: invalid action ", action);
    }
  };

  _fireActionPerformed(action, actionEvent) {
    actionEvent.finish = Date.now();

    // Appends states to existing collection
    if (actionEvent.addStates) {
      for (var keyAdd in actionEvent.addStates) {
        var entriesArray = actionEvent.addStates[keyAdd];
        if (Array.isArray(entriesArray)) {
          for (var x = 0; x < entriesArray.length; x++) {
            this._states[keyAdd].push(entriesArray[x]);
          }
          if (actionEvent.states[keyAdd] === undefined) {
            actionEvent.states[keyAdd] = this._states[keyAdd];
          }
        }
      }
    }

    // Remove states from collection
    if (actionEvent.removeStates) {
      for (var keyRemove in actionEvent.removeStates) {
        // TODO - Remove states
        var entriesArray = actionEvent.removeStates[keyRemove];

      }
    }

    for (var key in actionEvent.states) {
      this._states[key] = actionEvent.states[key]; // Save new state internally
      this._fireStateChanged(key, this._states[key]); // Push to listeners
    }
    if (actionEvent.path) {
      this.setPath(actionEvent.path);
    }

    var ctrl = action._smartflowCaller;

    if (actionEvent.commands) {
      for (var y = 0; y < ctrl.smartflow.componentInstances.length; y++) {
        var component = ctrl.smartflow.componentInstances[y];
        for (var z = 0; z < actionEvent.commands.length; z++) {
          var command = actionEvent.commands[z];
          if (component.id == command.id) {
            component.commandPerformed(command.command, command.value);
          }
        }
      }
    }

    action._smartflowStarted = undefined;

    action._smartflowCaller = undefined;
    this._action = undefined;

    if (action.smartflow.dialog) {
      var dialogID = this._findActionID(action);
      document.getElementById(dialogID).remove();
    }

    ctrl.actionPerformed(actionEvent);


    this._runRemainingActions();
  };

  _findParams(pathString) {
    var parameters = pathString.split("/");
    if (parameters[0] == "") {
      parameters.shift();
    }
    var firstElement = "/" + parameters.shift();
    return {
      "path": firstElement,
      "param": parameters
    };
  };

  //--------------------------------- Path ----------------------------------------
  findViewByPath(path) {
    for (var x = 0; x < this._controllers.length; x++) {
      var ctrl = this._controllers[x];
      if (ctrl.smartflow.path === path) {
        return ctrl;
      }
    }
    return undefined;
  }

  setPath(pathString) {
    var p = this._findParams(pathString);
    var firstElement = p.path;
    var parameters = p.param;
    if (this._controller && this._controller.smartflow.path === firstElement) {
      return;
    }
    var ctrl = this.findViewByPath(firstElement);
    this._path = pathString;
    this._controller = undefined;
    window.location.href = "#" + pathString;
    this._firePathChanged(firstElement, parameters);
    return ctrl != undefined;
  };

  _firePathChanged(path, parameters) {
    var ctrl;
    for (var x = 0; x < this._controllers.length; x++) {
      ctrl = this._controllers[x];
      if (ctrl.smartflow.path !== path) {
        if (ctrl.viewDisabled) {
          ctrl.viewDisabled();
        }
        this._setControllerVisible(ctrl, false);
      }
    }
    for (var y = 0; y < this._controllers.length; y++) {
      ctrl = this._controllers[y];
      if (ctrl.smartflow.path === path) {
        this._controller = ctrl;
        if (ctrl.viewEnabled) {
          ctrl.viewEnabled();
        }
        if (ctrl.pathChanged) {
          ctrl.pathChanged(path, parameters);
        }
        this._setControllerVisible(ctrl, true);
      }
    }
  };

  _setControllerVisible(ctrl, isVisible) {
    var el = document.getElementById(ctrl.constructor.name);
    if (el) {
      el.style.display = isVisible ? "block" : "none";
    }
  };

  //--------------------------------- State ----------------------------------------
  _fireStateChanged(state, value) {
    if (value === undefined || value == null) {
      delete( this._states[state] );
    } else {
      this._states[state] = value;
    }
    for (var x = 0; x < this._controllers.length; x++) {
      var ctrl = this._controllers[x];
      if (ctrl.stateChanged) {
        ctrl.stateChanged(state, value);
      }
      for (var y = 0; y < ctrl.smartflow.componentInstances.length; y++) {
        var compInstance = ctrl.smartflow.componentInstances[y];

        var states = compInstance.getStateBinding();

        if (Array.isArray(states) && states.indexOf(state) > -1) {
          compInstance.stateChanged(state, value);
        }

        if (compInstance.comp && compInstance.comp.state === state) {
        }
      }
    }
  };

  //--------------------------------- Formatter ----------------------------------------

  format(key, values) {
    return this._formatter.format(key, values);
  };

  formatJson(key, json) {
    return this._formatter.formatJson(key, json);
  };

  formatDate(date, format) {
    return this._formatter.formatDate(date, format);
  };

  formatNumber(value, format) {
    return this._formatter.formatNumber(value, format);
  };
}

