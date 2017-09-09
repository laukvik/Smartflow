
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
function Smartflow() {
  this._controller = undefined;
  this._controllers = [];
  this._actionQueue = [];
  this._locales = [];
  this._localeDefault = undefined;
  this.fireComponentChanged = function(component, property, value, view) {
    var componentEvent = {
      "component": component,
      "property" : property,
      "value" : value,
      "view" : view
    };
    view.componentChanged(componentEvent);
  }
  this.isAction = function(action){
    if (action === undefined) {
      return false;
    } else {
      if (action.constructor) {
        if (action.constructor.name){
          return true;
        }
      }
    }
    return false;
  };
  //--------------------------------- Config ---------------------------------
  this.setConfig = function (config) {
    this._config = config;
  };
  this.getConfig = function () {
    return this._config;
  };
  this.getRequestUrl = function (action) {
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
  };
  //--------------------------------- Locale ---------------------------------
  this.setDefaultLocale = function (locale) {
    this._localeDefault = locale;
  };
  this.getDefaultLocale = function () {
    return this._localeDefault;
  };
  this.loadLanguage = function (locale, data) {
    this._locales[locale] = data;
  };
  this.setLocale = function (locale) {
    this._locale = locale;
    this._formatter.config = this._locales[this._locale];
  };
  this.getLocale = function(){
    return this._locale;
  };
  this._autoDetectLocale = function () {
    var l = this.findClosestLocale(navigator.languages);
    this.setLocale(l === undefined ? this._localeDefault : l);
  };
  this.findClosestLocale = function (arr) {
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
  this.isView = function(ctrl){
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
  this.findView = function(name){
    if (typeof name !== 'string'){
      return undefined;
    }
    for (var x=0; x<this._controllers.length; x++) {
      var ctrl = this._controllers[ x ];
      if (ctrl.constructor.name == name){
        return ctrl;
      }
    }
    return undefined;
  };
  this.addView = function (ctrl) {
    if (!this.isView(ctrl)) {
      return false;
    }
    if (this.findView(ctrl.constructor.name)){
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
  this._buildComponents = function(ctrl) {
    // mount components
    if (ctrl.smartflow.components) {
      var builder = new ComponentBuilder(ctrl, this._formatter, this);
      builder.buildComponents();
    }
  };
  this.removeView = function(ctrl){
    if (!this.isView(ctrl)) {
      return false;
    }
    for (var x=0; x<this._controllers.length; x++) {
      var existCtrl = this._controllers[ x ];
      if (existCtrl.constructor.name === ctrl.constructor.name) {
        delete this._controllers[ x ];
        return true;
      }
    }
    return false;
  };
  //--------------------------------- Action runner ---------------------------------
  this.REQUEST_TIMEOUT = 3000;
  // Status codes
  this.HTTP_STATUS_CODE_INFO = 100;
  this.HTTP_STATUS_CODE_SUCCESS = 200;
  this.HTTP_STATUS_CODE_REDIRECT = 300;
  this.HTTP_STATUS_CODE_CLIENT_ERROR = 400;
  this.HTTP_STATUS_CODE_ERROR = 500;
  this.HTTP_STATUS_CODE_UNKNOWN = 600;
  // XMLHttpRequest
  this.READY_STATE_UNSENT = 0;
  this.READY_STATE_OPENED = 1;
  this.READY_STATE_HEADERS_RECEIVED = 2;
  this.READY_STATE_LOADING = 3;
  this.READY_STATE_DONE = 4;
  //
  this._states = [];
  this.start = function () {
    this._autoDetectLocale();
    for (var x = 0; x < this._controllers.length; x++) {
      var ctrl = this._controllers[x];
      ctrl.viewInitialized(this._formatter);
    }
    var anchor = window.location.hash;
    var path = anchor.indexOf("#") == 0 ? anchor.substr(1) : "/";
    this.setPath(path);
  };
  this.runAction = function (action, callerCtrl) {
    if (!this.isAction(action)){
      return false;
    }
    if (!this.isView(callerCtrl)){
      return false;
    }
    action._smartflowCaller = callerCtrl;
    this._actionQueue.push(action);
    this._runRemainingActions();
    return true;
  };
  this._findActionID = function(action){
    return action.constructor.name;
  };
  this._buildActionEvent = function(action){
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
  this._runRemainingActions = function () {
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
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (this.readyState === self.READY_STATE_DONE) {
            var statusCode = parseInt(this.status);
            actionEvent.response.status = statusCode;
            var contentType = this.getResponseHeader('content-type');
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
              var errorRedirectMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ")";
              actionEvent.path = action.smartflow.error.path;
              actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.error = errorRedirectMessage;
              actionEvent.states[action.smartflow.error.state] = errorRedirectMessage;
              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= self.HTTP_STATUS_CODE_CLIENT_ERROR && statusCode < self.HTTP_STATUS_CODE_ERROR) {
              // Client error
              var errorClientMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ") ";
              actionEvent.path = action.smartflow.error.path;
              actionEvent.params = self._findParams(actionEvent.path).param;
              actionEvent.error = errorClientMessage;
              actionEvent.states[action.smartflow.error.state] = errorClientMessage;
              self._fireActionPerformed(action, actionEvent);

            } else if (statusCode >= self.HTTP_STATUS_CODE_ERROR && statusCode < self.HTTP_STATUS_CODE_UNKNOWN) {
              // Server error
              var errorServerMessage = "Error: Server responded " + statusCode + " (" + action.constructor.name + ")  ";
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
          var errorTimeoutMessage = "Error: Timeout " + self.REQUEST_TIMEOUT + " ms for (" + action.constructor.name + ")";
          actionEvent.error = errorTimeoutMessage;
          actionEvent.states[action.smartflow.error.state] = errorTimeoutMessage;
          self._fireActionPerformed(action, actionEvent);
        };

        var url = self.getRequestUrl(action);
        if (url === undefined) {
          var errorUrlMessage = "Error: URL not specified for (" + action.constructor.name + ")";
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

        var builder = new ComponentBuilder();
        var d = action.smartflow.dialog;
        var html = builder.buildDialog(dialogID, d.title, d.body, d.buttons);
        var el = document.createElement("div");
        el.innerHTML = html;
        document.body.appendChild(el);

        var self = this;

        var stateName = d.state;

        for (var x=0; x<d.buttons.length; x++) {
          var btn = d.buttons[ x ];
          var buttonID = dialogID + "__button__" + btn.value;
          document.getElementById(buttonID).addEventListener("click", function(){
            var evt = self._buildActionEvent(action);
            evt.states[ stateName ] = btn.value;
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
  this._fireActionPerformed = function (action, actionEvent) {
    actionEvent.finish = Date.now();

    // Appends states to existing collection
    if (actionEvent.addStates) {
      for (var keyAdd in actionEvent.addStates) {
        var entriesArray = actionEvent.addStates[keyAdd];
        if (Array.isArray(entriesArray)) {
          for (var x=0; x<entriesArray.length; x++){
            this._states[ keyAdd ].push( entriesArray[x] );
          }
          if (actionEvent.states[keyAdd] === undefined) {
            actionEvent.states[keyAdd] = this._states[ keyAdd ];
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
      this._states[ key ] = actionEvent.states[key]; // Save new state internally
      this._fireStateChanged(key, this._states[ key ]); // Push to listeners
    }
    if (actionEvent.path){
      this.setPath(actionEvent.path);
    }

    var ctrl = action._smartflowCaller;

    if (actionEvent.commands) {
      for (var y=0; y<ctrl.smartflow.componentInstances.length; y++) {
        var component = ctrl.smartflow.componentInstances[ y ];
        for (var z=0; z<actionEvent.commands.length; z++) {
          var command = actionEvent.commands[ z ];
          if (component.id == command.id) {
            component.commandPerformed(command.command, command.value);
          }
        }
      }
    }

    action._smartflowStarted = undefined;

    action._smartflowCaller = undefined;
    this._action = undefined;

    if (action.smartflow.dialog){
      var dialogID = this._findActionID(action);
      document.getElementById(dialogID).remove();
    }

    ctrl.actionPerformed(actionEvent);



    this._runRemainingActions();
  };
  this._findParams = function(pathString){
    var parameters = pathString.split("/");
    if (parameters[0] == "") {
      parameters.shift();
    }
    var firstElement = "/" + parameters.shift();
    return {
      "path" : firstElement,
      "param" : parameters
    };
  };
  //--------------------------------- Path ----------------------------------------
  this.findViewByPath = function(path){
    for (var x = 0; x < this._controllers.length; x++) {
      var ctrl = this._controllers[ x ];
      if (ctrl.smartflow.path === path) {
        return ctrl;
      }
    }
    return undefined;
  };
  this.setPath = function (pathString) {
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
  this._firePathChanged = function (path, parameters) {
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
        if (ctrl.viewEnabled){
          ctrl.viewEnabled();
        }
        if (ctrl.pathChanged) {
          ctrl.pathChanged(path, parameters);
        }
        this._setControllerVisible(ctrl, true);
      }
    }
  };
  this._setControllerVisible = function (ctrl, isVisible) {
    var el = document.getElementById(ctrl.constructor.name);
    if (el) {
      el.style.display = isVisible ? "block" : "none";
    }
  };
  //--------------------------------- State ----------------------------------------
  this._fireStateChanged = function (state, value) {
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
      for (var y=0; y<ctrl.smartflow.componentInstances.length; y++) {
        var compInstance = ctrl.smartflow.componentInstances[y];

        var states = compInstance.getStateBinding();

        if (Array.isArray(states) && states.indexOf(state) > -1) {
          compInstance.stateChanged(state, value);
        }

        if (compInstance.comp && compInstance.comp.state === state){
        }
      }
    }
  };
  //--------------------------------- Formatter ----------------------------------------
  this._formatter = new Formatter({});
  this.format = function (key, values) {
    return this._formatter.format(key, values);
  };
  this.formatJson = function (key, json) {
    return this._formatter.formatJson(key, json);
  };
  this.formatDate = function (date, format) {
    return this._formatter.formatDate(date, format);
  };
  this.formatNumber = function (value, format) {
    return this._formatter.formatNumber(value, format);
  };
}


/**
 * Formats a String
 *
 * @param config
 * @constructor
 */
class Formatter {
  constructor(config){
    this.config = config;
    this._DATEFORMAT = 'YYYY.MM.DD';
    this._TIMEFORMAT = 'hh:mm:ss';
  }
  _leadingZero(v, padding) {
    var value = '' + v; // 1
    var remaining = padding - value.length; // 3 - 1
    for (var x=0; x<remaining; x++) {
      value = '0' + value;
    }
    return value;
  };
  formatDate(value, format) {
    if (value === undefined){
      return '';
    }
    if (format === undefined){
      return '';
    }
    var s = format;
    s = s.replace('YYYY', value.getFullYear(), 4);
    s = s.replace('Y', this._leadingZero(value.getFullYear()) );
    s = s.replace('MM', this._leadingZero(value.getMonth(), 2) );
    s = s.replace('M', value.getMonth());
    s = s.replace('DD', this._leadingZero(value.getDate(), 2) );
    s = s.replace('D', value.getDate());

    s = s.replace('hh',this._leadingZero(value.getHours(), 2));
    s = s.replace('h',value.getHours());
    s = s.replace('mm',this._leadingZero(value.getMinutes(), 2));
    s = s.replace('m',value.getMinutes());
    s = s.replace('ss',this._leadingZero(value.getSeconds(), 2));
    s = s.replace('s',value.getSeconds());

    s = s.replace('SSS',this._leadingZero(value.getMilliseconds(), 3));
    s = s.replace('S',value.getMilliseconds());

    return s;
  };
  /**
   *
   * #,###,###,##0.00
   *
   * 0 - Må være tall
   * # - Valgfri
   *
   * @param value
   * @param format
   * @returns {string}
   */
  formatNumber(value, format) {
    if (isNaN(value - parseFloat(value))) {
      return undefined;
    }
    var sValue = value.toString();

    var hasFractionValue = sValue.indexOf('.') > -1;

    var intV = '';
    var fraV = '';

    // Find the values separate
    if (hasFractionValue) {
      var arr = sValue.split(".");
      intV = arr[0];
      fraV = arr[1];
    } else {
      intV = sValue;
    }

    var intFormat;
    var fraFormat;

    var hasFractionFormat = format.indexOf('.') > - 1;

    // Find the format separate
    if (hasFractionFormat) {
      var arrFormat = format.split(".");
      intFormat = arrFormat[0];
      fraFormat = arrFormat[1];
    } else {
      intFormat = format;
    }

    // Build integer format
    var intString = "";
    for (var x=0; x<intFormat.length; x++) {
      // The format
      var f = intFormat[ intFormat.length - x - 1 ];
      // The value
      var v = x < intV.length ? intV[ intV.length - x - 1 ] : -1;

      if (v > -1){
        intString = ((f === '#' || f === '0') ? v : f) + intString;
      } else {
        x = intFormat.length;
      }
    }

    // Build fraction format
    var fraString = '';
    if (hasFractionFormat) {
      for (var x=0; x<fraFormat.length; x++) {
        var f = fraFormat[ x ];
        var v = x < fraV.length ? fraV[ x ] : 0;
        fraString += (f === '0'|| f === '#' ? v : f);
      }
    }

    return (hasFractionFormat) ? (intString + '.' + fraString) : intString;
  };
  formatJson(key, json) {
    if (key === undefined) {
      return '???undefined???';
    }
    var s = this.config[key];

    for (var k in json){
      var val = json[k];
      s = s.replace( '{' + k + '}', val );
    }
    return s;
  };
  format(key, keys) {
    if (key === undefined) {
      return undefined;
    }
    var value = this.config[key];
    if (value === undefined) {
      return "???" + key + "???";
    }
    if (keys === undefined) {
      return value;
    }
    var arr = [];
    if (Array.isArray(keys)) {
      arr = keys;
    } else {
      arr[0] = keys;
    }
    var s = value;
    for (var x = 0; x < arr.length; x++) {
      var symbol = "{" + x + "}";
      s = s.replace(symbol, arr[x]);
    }
    return s;
  };
}



class SmartflowComponent {
  constructor(comp, ctrl, builder) {
    this.comp = comp;
    this.setView(ctrl);
    this.builder = builder;
    this.stateListeners = [];
    this.setValidationMessage("Required");
  }

  setView(viewController) {
    this.ctrl = viewController;
  }

  getView() {
    return this.ctrl;
  }

  setSmartflow(smartflow) {
    this.smartflow = smartflow;
  }

  setElement(node) {
    this.rootNode = node;
  }

  getElement() {
    return this.rootNode;
  }

  getBodyNode() {
    return this.bodyNode;
  }

  setStateBinding(states) {
    var arr = [];
    for (var key in states) {
      arr.push(states[key]);
    }
    this.stateListeners = arr;
  }

  getStateBinding() {
    return this.stateListeners;
  }

  setID(id) {
    this.rootNode.setAttribute("id", id);
  }

  getID() {
    return this.rootNode.getAttribute("id");
  }

  setLabel(text) {
    this.labelNode.innerText = text;
  }

  getLabel() {
    return this.labelNode.innerText;
  }

  setError(text) {
    this.errorNode.innerText = text;
  }

  getError() {
    return this.errorNode.innerText;
  }

  buildRoot(name) {
    this.setElement(document.createElement("div"));
    this.rootNode.setAttribute("class", name);
  }

  buildRootWithLabel(name) {
    this.buildRoot(name);
    // label
    this.labelNode = document.createElement("div");
    this.labelNode.innerText = this.comp.label;
    this.rootNode.appendChild(this.labelNode);
    // Body
    this.bodyNode = document.createElement("div");
    this.getElement().appendChild(this.bodyNode);
    // Error
    this.errorNode = document.createElement("div");
    this.errorNode.setAttribute("class", "sf-error");
    this.getElement().appendChild(this.errorNode);
  }

  fireComponentChanged(property, value) {
    this.smartflow.fireComponentChanged(this, property, value, this.ctrl);
  }

  fireAction(action) {
    var func = eval(action);
    this.smartflow.runAction(new func(), this.getView());
  }

  setRequired(isRequired) {
    this.componentRequired = isRequired;
    this.labelNode.setAttribute("class", "sf-label" + (isRequired ? " sf-required" : ""));
  }

  isRequired() {
    return this.componentRequired;
  }

  removeChildNodes(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  isValid() {
    return true;
  }

  validate() {
    if (this.isValid()) {
      this.setError("");
      return true;
    } else {
      this.setError(this.validationMessage);
      return false;
    }
  }

  setValidationMessage(message) {
    this.validationMessage = message;
  }

  getValidationMessage() {
    return this.validationMessage;
  }
}

class Collections {
  constructor(component) {
    if (component.sort) {
      this.sortMatch = component.sort.match;
      this.sortOrder = component.sort.order;
    }
    this.sortEnabled = this.sortMatch !== undefined;

    this.pageSize = component.paging.size;
    this.pageIndex = component.paging.page;
    this.pageEnabled = this.pageSize !== undefined;

    this.filter = component.filter;
    this.filterEnabled = component.filter !== undefined;
  }

  find(items) {

    // Filter
    var filter = this.filter;
    var collectionFilter = function (item) {
      var count = 0;
      for (var x = 0; x < filter.length; x++) {
        var f = filter[x];
        var filterMatch = f['match'];
        var filterType = f['type'];
        var filterValue = f['value'];
        var value = item[filterMatch];
        if (filterType === 'eq') {
          if (value === filterValue) {
            count++;
          }
        } else if (filterType === 'contains') {
          if (Array.isArray(value)) {
            var found = false;
            for (var y = 0; y < value.length; y++) {
              if (value[y].toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
                count++;
              }
            }
            if (found) {
              count++;
            }
          } else {
            if (value.toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
              count++;
            }
          }
        }
      }
      return count === filter.length;
    };

    // Sorting
    var matchColumn = this.sortMatch;
    var negOrder = this.sortOrder === 'asc' ? -1 : 1;
    var posOrder = this.sortOrder === 'asc' ? 1 : -1;

    var collectionSorter = function (a, b) {
      var nameA = a[matchColumn];
      var nameB = b[matchColumn];
      if (nameA < nameB) {
        return negOrder;
      }
      if (nameA > nameB) {
        return posOrder;
      }
      return 0;
    };

    // Paging
    var paging = function (items, page, size) {
      var startIndex = page * size;
      var endIndex = startIndex + size;
      return items.slice(startIndex, endIndex);
    };

    var rows = items;
    if (this.filterEnabled) {
      rows = rows.filter(collectionFilter);
    }
    if (this.sortEnabled) {
      rows = rows.sort(collectionSorter);
    }
    if (this.pageEnabled) {
      rows = paging(rows, this.pageIndex, this.pageSize);
    }
    return rows;
  }

}

/**
 * Builds components in a controller based on declarations
 * as specified in the controller.
 *
 * @param ctrl
 * @constructor
 */
class ComponentBuilder {
  constructor(ctrl, formatter, smartflow) {
    this.ctrl = ctrl;
    this.formatter = formatter;
    this.smartflow = smartflow;
  }

  buildComponents() {
    var ctrlID = this.ctrl.constructor.name;
    var comps = this.ctrl.smartflow.components;
    this.ctrl.smartflow.componentInstances = [];
    var rootNode = document.getElementById(ctrlID);
    for (var x = 0; x < comps.length; x++) {
      this.buildChildNode(rootNode, comps[x]);
    }
  };

  buildChildNode(parentNode, comp) {
    var componentInstance = this._buildComponent(comp);
    this.ctrl.smartflow.componentInstances.push(componentInstance);
    componentInstance.setStateBinding(comp.states);
    var node = componentInstance.getElement();
    if (node === undefined) {
      console.warn("Component not found", comp);
    } else {
      parentNode.appendChild(node);
    }
    return componentInstance;
  }

  _buildComponent(comp) {
    var func = eval(comp.type); // ES
    if (func) {
      var f = new func(comp, this.ctrl, this);
      f.setSmartflow(this.smartflow);
      return f;
    } else {
      console.info("Component not found: ", comp.type);
      return undefined;
    }
  }

  buildDialog(dialogID, title, body, buttons) {
    var buttonsHtml = "";

    for (var x = 0; x < buttons.length; x++) {
      var btn = buttons[x];
      var buttonID = dialogID + "__button__" + btn.value;
      buttonsHtml += "<button type=\"button\" id=\"" +
        buttonID + "\"  class=\"mdc-button mdc-dialog__footer__button mdc-button--raised\">" + btn.label + "</button>";
    }

    return "<aside id=\"" + dialogID + "\"\n" +
      "       class=\"mdc-dialog mdc-dialog--open\" role=\"alertdialog\"\n" +
      "       aria-labelledby=\"my-mdc-dialog-label\" aria-describedby=\"my-mdc-dialog-description\">\n" +
      "  <div class=\"mdc-dialog__surface\">\n" +
      "    <header class=\"mdc-dialog__header\">\n" +
      "      <h2 class=\"mdc-dialog__header__title\">" + title + "</h2>\n" +
      "    </header>\n" +
      "    <section id=\"my-mdc-dialog-description\" class=\"mdc-dialog__body\">" + body + "</section>\n" +
      "    <footer class=\"mdc-dialog__footer\">\n" + buttonsHtml +
      "    </footer>\n" +
      "  </div>\n" +
      "  <div class=\"mdc-dialog__backdrop\"></div>\n" +
      "</aside>";
  }
}


class Button extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    var buttonNode = document.createElement("button");
    buttonNode.setAttribute("id", comp.id);
    buttonNode.setAttribute("class", "sf-button");
    this.action = comp.action;
    this.setElement(buttonNode);
    this.setText(comp.label);
    var self = this;
    buttonNode.addEventListener("click", function () {
      self.fireAction(self.action);
    }.bind(this), false);
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.getElement().removeAttribute("disabled");
    } else {
      this.getElement().setAttribute("disabled", "true");
    }
  }

  setText(text) {
    this.getElement().innerText = text;
  }

  getText() {
    return this.getElement().innerText;
  }

  stateChanged(state, value) {
    if (state == this.comp.states.value) {
      this.setText(value);
    } else if (state == this.comp.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.comp.states.label) {
      this.setLabel(value);
    }
  }
}


class Checkbox extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-checkbox", comp.required);
    this.optionsNode = document.createElement("div");
    this.getBodyNode().appendChild(this.optionsNode);
    this.setOptions(comp.options);
    this.setSelected(comp.selected);
    this.setLabel(comp.label);
    this.setRequired(comp.required);
  }

  isValid() {
    if (this.isRequired()) {
      var arr = this.getSelected();
      return arr.length > 0;
    }
    return true;
  }

  setVertical(isVertical) {
    this.vertical = isVertical;
    this.getElement().setAttribute("class", "sf-checkbox " + (isVertical ? "sf-checkbox-vertical" : "sf-checkbox-horisontal"));
  }

  isVertical() {
    return this.vertical;
  }

  setEnabled(isEnabled) {
    for (var x = 0; x < this.inputs.length; x++) {
      this.inputs[x].disabled = isEnabled;
    }
  }

  setSelected(selected) {
    for (var x = 0; x < this.inputs.length; x++) {
      var inp = this.inputs[x];
      var found = false;
      for (var y = 0; y < selected.length; y++) {
        var val = selected[y];
        if (inp.value == val) {
          found = true;
        }
      }
      inp.checked = found;
    }
  }

  getSelected() {
    var s = this.inputs.filter(function (inp) {
      return inp.checked
    }).map(function (inp, index) {
      return index;
    });
    if (!Array.isArray(s)) {
      return [];
    } else {
      return s;
    }
  }

  setOptions(items) {
    if (Array.isArray(items)) {
      this.inputs = [];
      this.removeChildNodes(this.optionsNode);
      for (var x = 0; x < items.length; x++) {
        var item = items[x];
        var itemText = item.text;
        var itemValue = item.value;
        var span = document.createElement("label");
        span.setAttribute("class", "sf-checkbox-option");
        this.optionsNode.appendChild(span);
        var input = document.createElement("input");
        this.inputs.push(input);
        span.appendChild(input);
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", itemValue);
        var text = document.createElement("span");
        span.appendChild(text);
        text.setAttribute("class", "sf-checkbox-option-label");
        text.innerText = itemText;
        // var self = this;
        // var inputs = this.inputs;
        // input.addEventListener("change", function (evt) {
        //   self.fireComponentChanged("selection", {
        //     "value": evt.srcElement.value,
        //     "selected": inputs.filter(function(inp){ return inp.checked}).map(function(inp, index){
        //       return index;
        //     })
        //   });
        // });

        input.addEventListener("change", function (evt) {
          this._changed(evt);
        }.bind(this), false);

      }
    } else {
      console.warn("Checkbox: Not an array: ", items)
    }
  }

  _changed(evt) {
    this.validate();
  }

  stateChanged(state, value) {
    if (state == this.comp.states.selected) {
      this.setSelected(value);
    } else if (state == this.comp.states.options) {
      this.setOptions(value);
    } else if (state == this.comp.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.comp.states.label) {
      this.setLabel(value);
    } else if (state == this.comp.states.required) {
      this.setRequired(value);
    }
  }
}

class Layout extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRoot("container");
    this.rows = document.createElement("div");
    this.getElement().appendChild(this.rows);
    this.rows.setAttribute("class", "row");

    if (Array.isArray(comp.components)) {
      for (var x = 0; x < comp.components.length; x++) {
        var c = comp.components[x];
        // Grid

        var colsXS = c["col-xs"] === undefined ? "" : " col-xs-" + c["col-xs"];
        var colsSM = c["col-sm"] === undefined ? "" : " col-sm-" + c["col-sm"];
        var colsMD = c["col-md"] === undefined ? "" : " col-md-" + c["col-md"];
        var colsLG = c["col-lg"] === undefined ? "" : " col-lg-" + c["col-lg"];
        var colsXL = c["col-xl"] === undefined ? "" : " col-xl-" + c["col-xl"];

        var gridClass = (colsXS + colsSM + colsMD + colsLG + colsXL);

        var layoutCell = document.createElement("div");
        layoutCell.setAttribute("class", gridClass);
        this.rows.appendChild(layoutCell);
        // Component
        builder.buildChildNode(layoutCell, c);
      }
    }
  }
}

class Pulldown extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-pulldown", comp.required);

    this.select = document.createElement("select");
    this.select.setAttribute("class", "sf-pulldown-select");
    this.getBodyNode().appendChild(this.select);

    //var self = this;
    // this.select.addEventListener("change", function (evt) {
    //   self.fireComponentChanged("selection", {
    //     "value": evt.srcElement.value,
    //     "selected": evt.srcElement.selectedIndex
    //   });
    // }).bind(this, false);


    this.select.addEventListener('change', function () {
      this._changed();
    }.bind(this), false);

    this.setOptions(comp.options);
    this.setSelected(comp.selected);
    this.setEnabled(comp.enabled);
    this.setRequired(comp.required);
    this.setLabel(comp.label);
  }

  _changed() {
    this.validate();
  }

  isValid() {
    if (this.isRequired()) {
      return this.getSelected() !== undefined;
    }
    return true;
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.select.removeAttribute("disabled");
    } else {
      this.select.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this.select.hasAttribute("disabled");
  }

  setOptions(items) {
    this.removeChildNodes(this.select);
    var optionEmpty = document.createElement("option");
    optionEmpty.value = "";
    this.select.appendChild(optionEmpty);

    for (var x = 0; x < items.length; x++) {
      var item = items[x];
      var itemText = item.text;
      var itemValue = item.value;
      var option = document.createElement("option");
      this.select.appendChild(option);
      option.setAttribute("value", itemValue);
      option.innerText = itemText;
    }
  }

  getSelected() {
    if (this.select.selectedIndex === 0) {
      return undefined;
    }
    return this.select.options[this.select.selectedIndex].value;
  }

  setSelected(selected) {
    for (var x = 0; x < this.select.options.length; x++) {
      var opt = this.select.options[x];
      opt.selected = opt.value == selected;
    }
  }

  stateChanged(state, value) {
    if (state == this.comp.states.selected) {
      this.setSelected(value);
    } else if (state == this.comp.states.options) {
      this.setOptions(value);
    } else if (state == this.comp.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.comp.states.label) {
      this.setLabel(value);
    } else if (state == this.comp.states.required) {
      this.setRequired(value);
    }
  }
}


class Radio extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-radio", comp.required);
    this.optionsNode = document.createElement("div");
    this.getElement().appendChild(this.optionsNode);
    this.inputs = [];
    this.setOptions(comp.options);
    this.setVertical(comp.vertical);
    this.setSelected(comp.selected);
    this.setLabel(comp.label);
    this.setRequired(comp.required);
  }

  isValid() {
    if (this.isRequired()) {
      return this.getSelected() !== undefined;
    }
    return true;
  }

  setEnabled(isEnabled) {
    for (var x = 0; x < this.inputs.length; x++) {
      this.inputs[x].disabled = true;
    }
  }

  getSelected() {
    for (var x = 0; x < this.inputs.length; x++) {
      var inp = this.inputs[x];
      if (inp.checked) {
        return inp;
      }
    }
  }

  setSelected(selected) {
    for (var x = 0; x < this.inputs.length; x++) {
      var inp = this.inputs[x];
      inp.checked = inp.value == selected;
    }
  }

  setVertical(isVertical) {
    this.vertical = isVertical;
    this.getElement().setAttribute("class", "sf-radio " + (isVertical ? "sf-radio-vertical" : "sf-radio-horisontal"));
  }

  isVertical() {
    return this.vertical;
  }

  setOptions(items) {
    if (Array.isArray(items)) {
      this.inputs = [];
      this.removeChildNodes(this.optionsNode);
      var gui = "sf-radio-" + Math.round(100000);
      for (var x = 0; x < items.length; x++) {
        var item = items[x];
        var itemText = item.text;
        var itemValue = item.value;
        var span = document.createElement("label");
        span.setAttribute("class", "sf-radio-option");
        this.optionsNode.appendChild(span);
        var input = document.createElement("input");
        this.inputs.push(input);
        span.appendChild(input);
        input.setAttribute("type", "radio");
        input.setAttribute("value", itemValue);
        input.setAttribute("name", gui);
        var text = document.createElement("span");
        span.appendChild(text);
        text.setAttribute("class", "sf-radio-option-label");
        text.innerText = itemText;
        var inputs = this.inputs;
        var self = this;
        input.addEventListener("change", function (evt) {
          self.fireComponentChanged("selection", {
            "value": evt.srcElement.value,
            "selected": inputs.filter(function (inp) {
              return inp.checked
            }).map(function (inp, index) {
              return index;
            })
          });
        });
      }
    } else {
      console.warn("Radio.setOptions: ", items);
    }
  }

  stateChanged(state, value) {
    if (state == this.comp.states.selected) {
      this.setSelected(value);
    } else if (state == this.comp.states.options) {
      this.setOptions(value);
    } else if (state == this.comp.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.comp.states.label) {
      this.setLabel(value);
    } else if (state == this.comp.states.required) {
      this.setRequired(value);
    }
  }
}


class Textfield extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-textfield", comp.required);
    if (comp.rows) {
      this.input = document.createElement("textarea");
      this.input.setAttribute("rows", comp.rows);
      this.input.setAttribute("class", "sf-textfield-input");
    } else {
      this.input = document.createElement("input");
      this.input.setAttribute("type", "text");
      this.input.setAttribute("class", "sf-textfield-input");
    }
    this.input.setAttribute("placeholder", comp.placeholder);
    this.getBodyNode().appendChild(this.input);
    this.input.addEventListener('keyup', function () {
      this._changed();
    }.bind(this), false);
    this.setText(comp.value);
    if (comp.validation) {
      this.setRegex(comp.validation.regex);
      this.validationMessage = comp.validation.message;
    }
    this.setRequired(comp.required);
    this.setLabel(comp.label);
  }

  _changed() {
    this.validate();
  }

  isValid() {
    if (this.getText() === '') {
      if (this.isRequired()) {
        return false;
      }
    }
    if (this.regex === undefined) {
      // No validation
      if (this.isRequired()) {
        return this.input.value.length > 0;
      }
      return true;
    }
    return this.regex.test(this.input.value);
  }

  setRegex(regex) {
    if (regex === undefined) {
      this.regex = undefined;
    }
    this.regex = new RegExp(regex);
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.input.removeAttribute("disabled");
    } else {
      this.input.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this.input.hasAttribute("disabled");
  }

  setPlaceholder(text) {
    this.input.setAttribute("placeholder", text);
  }

  getPlaceholder() {
    return this.input.getAttribute("placeholder");
  }

  setText(text) {
    this.input.value = text == undefined ? "" : text;
  }

  getText() {
    var s = this.input.value;
    console.info("getText: ", s);
    return s === undefined ? '' : s;
  }

  stateChanged(state, value) {
    if (state == this.comp.states.value) {
      this.setText(value);
    } else if (state == this.comp.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.comp.states.label) {
      this.setLabel(value);
    } else if (state == this.comp.states.required) {
      this.setRequired(value);
    }
  }
}
