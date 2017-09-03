'use strict';
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
 * TODO - enable local storage
 * TODO - documentation tool available
 * TODO - path is not required - go to oneself
 * TODO - get is default method
 * TODO - features - switches for UI elements (toggles display on/off)
 * TODO - support number formats
 * TODO - support for application/json;utf-8 etc
 * TODO - Server Action må returnere headere
 * TODO - Material: Components, Child components, Custom components
 * TODO - Custom component - OK
 * TODO - Textfield component
 * TODO - textarea component
 * TODO - button component
 * TODO - radio component
 * TODO - dialog component
 * TODO - tab component
 * TODO - pulldown component
 * TODO - grid component
 * TODO - toolbar component
 * TODO - table component
 *
 *
 * @constructor
 */
function Smartflow() {
  this._controller = undefined;
  this._controllers = [];
  this._actionQueue = [];
  this._locales = [];
  this._localeDefault = undefined;
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
      var builder = new ComponentBuilder(ctrl, this._formatter);
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
      "finish": undefined
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
        actionEvent.params = this._findParams(actionEvent.path).param;
        delete (actionEvent.request);
        delete (actionEvent.response);
        actionEvent.states = action.smartflow.states === undefined ? {} : action.smartflow.states;
        this._fireActionPerformed(action, actionEvent);
      }
    } else {
      //console.error("App: invalid action ", action);
    }
  };
  this._fireActionPerformed = function (action, actionEvent) {
    actionEvent.finish = Date.now();
    for (var key in actionEvent.states) {
      this._fireStateChanged(key, actionEvent.states[key]);
    }
    if (actionEvent.path){
      this.setPath(actionEvent.path);
    }

    action._smartflowStarted = undefined;
    var ctrl = action._smartflowCaller;
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
    }
    // Update DOM with state bindings
    var states = {};
    states[ state ] = value;
    var els = document.querySelectorAll('[data-smartflow-state]');
    for (var z=0; z<els.length; z++){
      var el = els[z];
      var stateExpression = el.getAttribute("data-smartflow-state");
      if (stateExpression === state) {
        el.innerHTML = value === undefined ? '' : value;
      } else if (stateExpression.indexOf(state + ".") === 0) {
        if (value === undefined){
          el.innerHTML = "";
        } else {
          // TODO - Add support for unknown depth of references in state
          var arr = stateExpression.split(".");
          var subkey = arr[ 1 ];
          el.innerHTML = value[ subkey ] === undefined ? '' : value[ subkey ];
        }
      }
    }
  };
  //--------------------------------- Formatter ----------------------------------------
  this._formatter = new SmartflowFormatter({});
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
function SmartflowFormatter(config) {
  this.config = config;
  this._DATEFORMAT = 'YYYY.MM.DD';
  this._TIMEFORMAT = 'hh:mm:ss';
  this._leadingZero = function (v, padding) {
    var value = '' + v; // 1
    var remaining = padding - value.length; // 3 - 1
    for (var x=0; x<remaining; x++) {
      value = '0' + value;
    }
    return value;
  };
  this.formatDate = function (value, format) {
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
  this.formatNumber = function (value, format) {
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
  this.formatJson = function (key, json) {
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
  this.format = function (key, keys) {
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

/**
 * Builds components in a controller based on declarations
 * as specified in the controller.
 *
 * @param ctrl
 * @constructor
 */
function ComponentBuilder(ctrl, formatter){
  this.ctrl = ctrl;
  this.formatter = formatter;
  this.buildComponents = function () {
    var ctrlID = ctrl.constructor.name;
    var comps = ctrl.smartflow.components;
    this._buildChildNodes( document.getElementById(ctrlID), comps);
  };
  this._buildChildNodes = function(parentNode, components){
    for (var x=0; x<components.length; x++) {
      var comp = components[x];
      var node = this._buildComponent(comp);
      if (node === undefined) {
        console.info("Component not found", comp);
      } else {
        parentNode.appendChild(node);
      }
    }
  };
  this._buildComponent = function(comp){
    var func = window[ comp.type ];
    if (func){
      return func(comp, this.ctrl, this);
    } else {
      console.info("Component not found: ", comp.type);
      return undefined;
    }
  };

  this.buildDialog = function( dialogID, title, body, buttons ){
    var buttonsHtml = "";

    for (var x=0; x<buttons.length; x++) {
      var btn = buttons[ x ];
      var buttonID = dialogID + "__button__" + btn.value;
      buttonsHtml += "<button type=\"button\" id=\"" +
        buttonID +"\"  class=\"mdc-button mdc-dialog__footer__button mdc-button--raised\">" + btn.label + "</button>";
    }

    return "<aside id=\"" + dialogID + "\"\n" +
      "       class=\"mdc-dialog mdc-dialog--open\" role=\"alertdialog\"\n" +
      "       aria-labelledby=\"my-mdc-dialog-label\" aria-describedby=\"my-mdc-dialog-description\">\n" +
      "  <div class=\"mdc-dialog__surface\">\n" +
      "    <header class=\"mdc-dialog__header\">\n" +
      "      <h2 class=\"mdc-dialog__header__title\">"+ title +"</h2>\n" +
      "    </header>\n" +
      "    <section id=\"my-mdc-dialog-description\" class=\"mdc-dialog__body\">"+ body +"</section>\n" +
      "    <footer class=\"mdc-dialog__footer\">\n" + buttonsHtml +
      "    </footer>\n" +
      "  </div>\n" +
      "  <div class=\"mdc-dialog__backdrop\"></div>\n" +
      "</aside>";
  };
}

function Dialog(comp, ctrl, builder) {
  var rootNode = document.createElement("aside");
  rootNode.setAttribute("id", comp.id);
  rootNode.setAttribute("class", "mdc-dialog mdc-dialog--open");
  rootNode.setAttribute("role", "alertdialog");

  var surfaceNode = document.createElement("div");
  surfaceNode.setAttribute("class", "mdc-dialog__surface");

  var headerNode = document.createElement("header");

  headerNode.setAttribute("class", "mdc-dialog__header");

  var titleNode = document.createElement("h2");

  titleNode.setAttribute("class", "dialog__header__title");
  titleNode.innerText = comp.title;


  var backdropNode = document.createElement("div");
  backdropNode.setAttribute("class", "mdc-dialog__backdrop");

  var bodyNode = document.createElement("section");
  bodyNode.setAttribute("class", "mdc-dialog__body");

  var footerNode = document.createElement("section");
  footerNode.setAttribute("class", "mdc-dialog__footer");

  builder._buildChildNodes(footerNode, comp.actions);

  rootNode.appendChild(surfaceNode);
  surfaceNode.appendChild(headerNode);
  surfaceNode.appendChild(bodyNode);
  surfaceNode.appendChild(footerNode);
  headerNode.appendChild(titleNode);
  rootNode.appendChild(backdropNode);

  return rootNode;
}


function Button(comp, ctrl, builder) {
  var buttonNode = document.createElement("button");
  buttonNode.setAttribute("id", comp.id);
  buttonNode.setAttribute("class", "mdc-button mdc-button--raised");
  buttonNode.innerText = comp.label;
  buttonNode.addEventListener("click", function () {
    if (comp.action){
      var func = window[ comp.action ];
      if (func){
        ctrl.runSmartflow(new func());
      }
    }
    if (ctrl.componentChanged) {
      ctrl.componentChanged(
        {
          "component": this,
          "event": "click"
        }
      );
    }
  });
  return buttonNode;
}


function Table(comp, ctrl, builder) {
  var rootNode = document.createElement("table");
  rootNode.setAttribute("border", "1");
  rootNode.setAttribute("class", "mdc-data-table");
  var columns = comp.columns;
  var headNode = document.createElement("thead");
  var headerRowNode = document.createElement("tr");
  headNode.appendChild(headerRowNode);
  for (var x=0; x<columns.length; x++) {
    var column = columns[ x ];
    var thNode = document.createElement("th");
    thNode.innerText = column.label;
    headerRowNode.appendChild(thNode);
  }
  var bodyNode = document.createElement("tbody");
  var rows = comp.rows;
  for (var y=0; y< rows.length; y++){
    var rowNode = document.createElement("tr");
    bodyNode.appendChild(rowNode);
    var rowData = rows[ y ];
    for (var x=0; x<columns.length; x++) {
      var column = columns[ x ];
      var cellData = rowData[ column.key ];
      var tdNode = document.createElement("td");
      rowNode.appendChild(tdNode);
      if (column.format) {
        tdNode.innerText = builder.formatter.formatDate(cellData, column.format);
      } else {
        tdNode.innerText = cellData;
      }
    }
  }
  rootNode.appendChild(headNode);
  rootNode.appendChild(bodyNode);
  return rootNode;
}

function Label(comp, ctrl, builder) {
  var node = document.createElement("label");
  node.setAttribute("id", comp.id);
  node.setAttribute("class", comp.class);
  node.innerText = comp.label;
  return node;
}

function Card(comp, ctrl, builder) {
  var rootNode = document.createElement("div");
  rootNode.setAttribute("class", "mdc-card");

  var headerNode = document.createElement("section");
  headerNode.setAttribute("class", "mdc-card__primary");

  var h1Node = document.createElement("h1");
  h1Node.setAttribute("class", "mdc-card__title mdc-card__title--large");
  h1Node.innerText = comp.title;

  var h2Node = document.createElement("h2");
  h2Node.setAttribute("class", "mdc-card__subtitle");
  h2Node.innerText = comp.subtitle;

  var textNode = document.createElement("section");
  textNode.setAttribute("class", "mdc-card__supporting-text");

  var bodyNode = document.createElement("section");

  builder._buildChildNodes(bodyNode, comp.components);

  var footerNode = document.createElement("section");
  footerNode.setAttribute("class", "mdc-card__actions");
  builder._buildChildNodes(footerNode, comp.actions);

  rootNode.appendChild(headerNode);
  headerNode.appendChild(h1Node);
  headerNode.appendChild(h2Node);
  rootNode.appendChild(bodyNode);
  rootNode.appendChild(footerNode);

  return rootNode;
}

function Textfield(comp, ctrl, builder){
  var node = document.createElement("div");

  var labelNode = document.createElement("label");
  labelNode.setAttribute("for", "my-textfield");
  labelNode.setAttribute("class", "mdc-label");
  labelNode.innerText = comp.label;

  var divNode = document.createElement("div");
  divNode.setAttribute("class", "mdc-textfield");

  var inputNode = document.createElement("input");
  inputNode.setAttribute("id", "my-textfield");
  inputNode.setAttribute("type", "text");
  inputNode.setAttribute("placeholder", comp.placeholder);
  inputNode.setAttribute("class", "mdc-textfield__input");

  node.appendChild(labelNode);
  node.appendChild(divNode);
  divNode.appendChild(inputNode);

  inputNode.addEventListener("keyup", function () {
    ctrl.componentChanged(
      {
        "component": this,
        "event": "keyup"
      }
    );
  });
  return node;
}


module.exports = Smartflow;
