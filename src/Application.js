/**
 * Application
 *
 * @example <caption>Starting an application two views</caption>
 *
 * let app = new Application();
 * app.addView(new MainView());
 * app.addView(new InboxView());
 * app.start();
 *
 * @author Morten Laukvik
 *
 */
import {Formatter} from "./Formatter";
import {Builder} from "./Builder";
import {View} from "./View";
import {ServerAction} from "./ServerAction";
import {ClientAction} from "./ClientAction";
import {Path} from "./Path";
import {Scope, SCOPES} from "./Scope";

const HTTP_STATUS_CODES = {
  INFO: 100,
  SUCCESS: 200,
  REDIRECT: 300,
  CLIENT_ERROR: 400,
  ERROR: 500,
  UNKNOWN: 600
};

const READY_STATE = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
};

export class Application {

  constructor() {
    this._controller = undefined;
    this._controllers = [];
    this._actionQueue = [];
    this._locales = [];
    this._localeDefault = undefined;
    //--------------------------------- Action runner ---------------------------------
    this.REQUEST_TIMEOUT = 3000;
    this._formatter = new Formatter({});
    //
    this._states = [];
  }

  firePropertyChanged(component, binding, value) {
    if (binding.scope === SCOPES.VIEW) {
      component.getView()._states[ binding.state ] = value;
      this._firePrivateStateChanged(binding.state, value, component.getView(), component);
    } else if (binding.scope === SCOPES.GLOBAL) {
      this._states[ binding.state ] = value;
      this._fireGlobalStateChanged(binding.state, value);
    }
  }

  fireComponentChanged(component, property, value, view) {
    let componentEvent = {
      "component": component,
      "property": property,
      "value": value,
      "view": view
    };
    view.componentChanged(componentEvent);
  }

  /**
   * Returns true if the action is an Action instance
   * @param {Action} action the action
   * @returns {boolean}
   */
  isAction(action) {
    return Object.getPrototypeOf(action) instanceof ClientAction || Object.getPrototypeOf(action) instanceof ServerAction;
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
      return undefined;
    }
    if (this._config === undefined) {
      return undefined;
    }
    let key = action.constructor.name;
    let val = this._config[key];
    if (val === undefined) {
      return action.getSmartflow().request.url;
    } else {
      return val;
    }
  }

  //--------------------------------- Locale ---------------------------------
  /**
   * Sets the default locale
   *
   * @param locale
   */
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
    let l = this.findClosestLocale(navigator.languages);
    this.setLocale(l === undefined ? this._localeDefault : l);
  }

  findClosestLocale(arr) {
    for (let x = 0; x < arr.length; x++) {
      let locale = arr[x];
      let language = locale.indexOf("-") > -1 ? locale : locale.split("-")[0];
      if (this._locales[language] !== undefined) {
        return language;
      }
    }
    return undefined;
  }

  //--------------------------------- View ----------------------------------------
  /**
   * Returns true if the view is an instance of View
   * @param {View} view
   * @returns {boolean}
   */
  isView(view) {
    return view instanceof View;
  }

  /**
   * Adds the view
   *
   * @param {View} view the view
   *
   */
  addView(view) {
    if (!this.isView(view)) {
      console.warn("Smartflow: Not a view ", view);
      return;
    }
    this._controllers.push(view);
    view.setSmartflowInstance(this);
    view._states = {};
    this._buildComponents(view);
  }

  _buildComponents(view) {
    if (view.smartflow.components) {
      let builder = new Builder(view, this._formatter, this);
      builder.buildComponents();
    }
  }

  /**
   * Removes the view
   *
   * @param {View} view the view
   */
  removeView(view) {
    if (!this.isView(view)) {
      return;
    }
    for (let x = 0; x < this._controllers.length; x++) {
      let existCtrl = this._controllers[x];
      if (existCtrl.constructor.name === view.constructor.name) {
        delete this._controllers[x];
        return true;
      }
    }
  }

  /**
   * Starts the application.
   *
   */
  start() {
    this._autoDetectLocale();
    for (let x = 0; x < this._controllers.length; x++) {
      let ctrl = this._controllers[x];
      ctrl.viewInitialized(this._formatter);
    }
    let anchor = window.location.hash;
    let path = anchor.indexOf("#") === 0 ? anchor.substr(1) : "/";
    this.setPath(path);
  }

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
  }

  _findActionID(action) {
    return action.constructor.name;
  }

  _buildActionEvent(action) {
    return {
      "action": {
        "name": this._findActionID(action),
        "value": action.getSmartflow()
      },
      "states": {},
      "global": {},
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
  }

  /**
   * Runs the remaining actions in the queue - in serial.
   *
   * @private
   */
  _runRemainingActions() {
    if (this._action !== undefined) {
      return;
    }
    let action = this._actionQueue.shift();
    if (action === undefined) {
      return;
    }
    this._action = action;

    // Event object
    let actionEvent = this._buildActionEvent(action);

    if (!action.getSmartflow().commands) {
      delete (actionEvent.commands)
    } else {
      actionEvent.commands = action.getSmartflow().commands;
    }

    //
    action._smartflowStarted = new Date();
      if (action.getSmartflow().request) {
        // Run with request
        let self = this;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (this.readyState === READY_STATE.DONE) {
            let statusCode = parseInt(this.status);
            actionEvent.response.status = statusCode;
            let contentType = this.getResponseHeader('content-type');
            actionEvent.response.contentType = contentType;

            if (contentType.indexOf('application/json') === 0) {
              actionEvent.response.body = JSON.parse(this.response);
            } else if (contentType === 'application/xml') {
              actionEvent.response.body = this.responseXML;
            } else {
              actionEvent.response.body = this.response;
            }

            if (statusCode >= HTTP_STATUS_CODES.INFO && statusCode < HTTP_STATUS_CODES.SUCCESS) {
              // Information

            } else if (statusCode === HTTP_STATUS_CODES.SUCCESS) {
              // Success
              actionEvent.path = action.getSmartflow().success.path;
              //actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.states[action.getSmartflow().success.state] = actionEvent.response.body;

              actionEvent.global[action.getSmartflow().success.global] = actionEvent.response.body;

              delete (actionEvent.error);

              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= HTTP_STATUS_CODES.REDIRECT && statusCode < HTTP_STATUS_CODES.ERROR) {
              // Redirect
              let errorRedirectMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ")";
              actionEvent.path = action.getSmartflow().error.path;
              //actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.error = errorRedirectMessage;
              actionEvent.states[action.getSmartflow().error.state] = errorRedirectMessage;
              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= HTTP_STATUS_CODES.ERROR && statusCode < HTTP_STATUS_CODES.ERROR) {
              // Client error
              let errorClientMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ") ";
              actionEvent.path = action.getSmartflow().error.path;
              //actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.error = errorClientMessage;
              actionEvent.states[action.getSmartflow().error.state] = errorClientMessage;
              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= HTTP_STATUS_CODES.ERROR && statusCode < HTTP_STATUS_CODES.UNKNOWN) {
              // Server error
              let errorServerMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ")  ";
              actionEvent.path = action.getSmartflow().error.path;
              //actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.error = errorServerMessage;
              actionEvent.states[action.getSmartflow().error.state] = errorServerMessage;
              self._fireActionPerformed(action, actionEvent);
            }
          }
        };
        xhr.timeout = self.REQUEST_TIMEOUT;
        xhr.ontimeout = function () {
          // XMLHttpRequest timed out
          let errorTimeoutMessage = "Error: Timeout " + self.REQUEST_TIMEOUT + " ms for (" + action.constructor.name + ")";
          actionEvent.error = errorTimeoutMessage;
          actionEvent.states[action.getSmartflow().error.state] = errorTimeoutMessage;
          self._fireActionPerformed(action, actionEvent);
        };

        let url = self.getRequestUrl(action);
        if (url === undefined) {
          let errorUrlMessage = "Error: URL not specified for (" + action.constructor.name + ")";
          actionEvent.error = errorUrlMessage;
          actionEvent.states[action.getSmartflow().error.state] = errorUrlMessage;
          self._fireActionPerformed(action, actionEvent);
        } else {
          actionEvent.request.method = action.getSmartflow().request.method;
          actionEvent.request.url = url;
          xhr.open(action.getSmartflow().request.method, url, true);
          xhr.send();
        }

      } else {
        // Run without request
        delete (actionEvent.error);
        if (action.runAction) {
          action.runAction();
        }
        actionEvent.path = action.getSmartflow().path;
        delete (actionEvent.request);
        delete (actionEvent.response);
        actionEvent.states = action.getSmartflow().states === undefined ? {} : action.getSmartflow().states;
        actionEvent.addStates = action.getSmartflow().addStates === undefined ? {} : action.getSmartflow().addStates;
        actionEvent.removeStates = action.getSmartflow().removeStates === undefined ? {} : action.getSmartflow().removeStates;

        actionEvent.global = action.getSmartflow().global === undefined ? {} : action.getSmartflow().global;
        this._fireActionPerformed(action, actionEvent);
      }

  }

  /**
   * Informs all controllers about global state changes and only informs the current controller
   * about the private states.
   *
   * @param {Action} action the action
   * @param actionEvent
   * @private
   */
  _fireActionPerformed(action, actionEvent) {
    actionEvent.finish = Date.now();

    // Find the "from" view controller
    let viewController = action._smartflowCaller;

    // View state
    for (let key in actionEvent.states) {
      viewController._states[key] = actionEvent.states[key]; //
      this._firePrivateStateChanged(key, viewController._states[key], viewController); // Push to listeners
    }

    // Global state
    for (let key in actionEvent.global) {
      this._states[key] = actionEvent.global[key]; // Save new state internally
      this._fireGlobalStateChanged(key, this._states[key]); // Push to listeners
    }

    if (actionEvent.path !== undefined) {
      this.setPath(this.translateScopeVariables(actionEvent.path, viewController));
    }

    action._smartflowStarted = undefined;
    action._smartflowCaller = undefined;

    // Remove injected variables
    delete (action._smartflowStarted);
    delete (action._smartflowCaller);

    this._action = undefined;
    viewController.actionPerformed(actionEvent);
    this._runRemainingActions();
  }

  /**
   * Searches a string for references to state variables and converts them
   * into real values.
   *
   * @param path the string to translate
   * @param view the active view
   * @returns {*}
   */
  translateScopeVariables(path, view) {
    let scopesArr = Scope.findScopes(path);
    let value = path;
    for (let x=0; x<scopesArr.length; x++) {
      let s = scopesArr[ x ];
      if (s.scope === SCOPES.GLOBAL) {
        value = Scope.replace(s, value, this._states[ s.value ]);
      } else if (s.scope === SCOPES.VIEW) {
        value = Scope.replace(s, value, view._states[ s.value]);
      }
    }
    return value;
  }

  //--------------------------------- Path ----------------------------------------
  findViewByPath(path) {
    for (let x = 0; x < this._controllers.length; x++) {
      let view = this._controllers[x];
      if (view.smartflow.path){
        let p = new Path(view.smartflow.path);
        if (p.matches(path)) {
          return view;
        }
      }
    }
    return undefined;
  }

  setPath(pathString) {
    let view = this.findViewByPath(pathString);
    if (!view) {
      return;
    }
    let p = new Path(view.smartflow.path);
    let map = p.parse(pathString);
    this._path = pathString;
    this._controller = view;
    window.location.href = "#" + pathString;
    this._firePathChanged(pathString, map);
  }

  getView(){
    return this._controller;
  }

  _firePathChanged(path, map) {
    let ctrl;
    for (let x = 0; x < this._controllers.length; x++) {
      ctrl = this._controllers[x];
      if (ctrl.smartflow.path !== undefined) {
        let p = new Path(ctrl.smartflow.path);
        if (ctrl.smartflow.path !== undefined && !p.matches(path)) {
          ctrl.viewDisabled();
          this._setViewVisible(ctrl, false);
        }
      }
    }
    for (let y = 0; y < this._controllers.length; y++) {
      ctrl = this._controllers[y];
      if (ctrl.smartflow.path !== undefined) {
        let p = new Path(ctrl.smartflow.path);
        if (p.matches(path)) {
          this._controller = ctrl;
          ctrl.viewEnabled();
          ctrl.pathChanged(path, map);
          this._setViewVisible(ctrl, true);
        }
      }
    }
  }

  _setViewVisible(ctrl, isVisible) {
    let el = document.getElementById(ctrl.constructor.name);
    if (el) {
      el.style.display = isVisible ? "block" : "none";
    }
  }

  //--------------------------------- State ----------------------------------------
  _fireGlobalStateChanged(state, value) {
    // console.info("GlobalState: ", state, value);
    for (let x = 0; x < this._controllers.length; x++) {
      let viewController = this._controllers[x];
      // Loop each component in view
      for (let index in viewController.smartflow.componentInstances) {
        let componentInstance = viewController.smartflow.componentInstances[ index ];
        let binding = componentInstance.getBindingByState(state, SCOPES.GLOBAL);
        if (binding) {
          componentInstance.setProperty(binding.property, value);
        }
      }
      // Notify controller
      viewController.globalChanged(state, value);
    }
  }

  _firePrivateStateChanged(state, value, viewController, fromComponent) {
    if (value === undefined || value === null) {
      delete( this._states[state] );
    } else {
      this._states[state] = value;
    }

    // Loop each component in view
    for (let index in viewController.smartflow.componentInstances) {
      let componentInstance = viewController.smartflow.componentInstances[ index ];
      if (componentInstance !== fromComponent) {
        let binding = componentInstance.getBindingByState(state, SCOPES.VIEW);
        if (binding) {
          componentInstance.setProperty(binding.property, value, binding.path);
        }
      }
    }

    // Inform view controller
    viewController.stateChanged(state, value);
  }
}

