import {SCOPES} from "./Application";

/**
 *
 *
 * @private
 */
export class Component {

  constructor(properties) {
    this.properties = properties;
    this._stateListeners = [];
    this._componentNode = null;
    this._valueBindings = {};
  }

  setProperties(properties){
    if (typeof properties === "object") {
      for (let key in properties) {
        let value = properties[ key ];
        this.setProperty(key, value);
      }
    }
  }

  /**
   * Sets the value for a named property
   *
   * @param name
   * @param value
   */
  setProperty(name, value) {
  }

  /**
   * Informs Smartflow that the value of the property changed. This method
   * should only be called from the component when the component changed its
   * properties.
   *
   * @param name
   * @param value
   * @private
   */
  firePropertyChanged(name, value) {
    let binding = this._valueBindings[ name ];
    if (binding === undefined) {
      let a = this;
      console.info(a.constructor.name, " invalid property ", name);
      return;
    }
    this.smartflow.firePropertyChanged(this, binding, value);
  }

  /**
   * Binds a variable name to a scope
   *
   * @param name
   * @param scope
   */
  setBinding(name, value, scope, path) {
    if (name === undefined) {
      return;
    }
    if (scope === undefined) {
      delete this._valueBindings[ name ];
      return;
    }
    if (scope === SCOPES.NONE || scope === SCOPES.VIEW || scope === SCOPES.GLOBAL) {
      this._valueBindings[ name ] = {
        "state" : value,
        "property" : name,
        "scope": scope,
        "path": path
      };
    } else {
      console.warn("SmartflowComponent: invalid scope ", scope);
    }
  }

  getBindingByState(state, scope) {
    for (let propertyName in this._valueBindings) {
      let b = this._valueBindings[ propertyName ];
      if (b.scope == scope && b.state == state){
        return b;
      }
    }
  }

  parseScope(value){
    let isString = typeof value === 'string';
    if (!isString) {
      return {
        "scope": SCOPES.NONE,
        "value": value
      };
    }
    if (value.indexOf("{") === 0 && value.lastIndexOf("}") === value.length-1) {
      let innerValue = value.substring(1, value.length-1);
      if (innerValue.toUpperCase().startsWith(SCOPES.GLOBAL)) {
        return {
          "scope": SCOPES.GLOBAL,
          "value": innerValue.substring(7)
        }
      } else {
        return {
          "scope": SCOPES.VIEW,
          "value": innerValue
        }
      }
    }
    return {
      "scope": SCOPES.NONE,
      "value": value
    };
  }

  setProperties(properties) {
    this.setID(properties.id);
    this.setClass(properties.class);
    this._properties = properties;
  }

  buildComponent() {
    let div = document.createElement("div");
    div.innerText = "[Smartflow:" + this.constructor.name + "]";
    return div;
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

  setVisible(visible) {
    this._componentNode.style.display = visible == true ? "block" : "none";
  }

  setID(id) {
    this._componentID = id;
    if (id != undefined) {
      this._componentNode.setAttribute("id", id);
    }
  }

  getID() {
    return this._componentID;
  }

  setBaseClass(baseClass){
    this._componentBaseClass = baseClass;
  }

  setClass(className) {
    this._componentClass = className;
    this._componentNode.setAttribute("class", this._componentBaseClass + (className == undefined ? "" : className));
  }

  getClass() {
    return this._componentClass;
  }

  fireAction(action) {
    this.smartflow.runAction(new action(), this.getView());
  }

  removeChildNodes(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

}

