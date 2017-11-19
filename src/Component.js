import {SCOPES} from "./Scope";

/**
 *
 *
 * @private
 */
export class Component {

  constructor() {
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
   * Creates an HTML node
   * @param tagName the name of the tag
   * @param baseClass the component CSS class name
   * @param cssClass the custom CSS class name
   */
  createComponentNode(tagName, cssClass) {
    this._componentNode = document.createElement(tagName);
    this._componentBaseClass = cssClass;
  }

  getComponentNode(){
    return this._componentNode;
  }

  /**
   * Informs the application that the value of the property changed. This method
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
      console.warn(a.constructor.name + ": invalid property ", name, value, this._valueBindings);
      return;
    }
    this.getView().getApplication().firePropertyChanged(this, binding, value);
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
    console.info("setBinding: ", name, value, scope, path);
    if (scope === SCOPES.NONE || scope === SCOPES.VIEW || scope === SCOPES.GLOBAL  || scope === SCOPES.COMPONENT) {
      this._valueBindings[ name ] = {
        "state" : value,
        "property" : name,
        "scope": scope,
        "path": path
      };
    } else {
      console.warn("Component: invalid scope ", scope);
    }
  }

  getBindingByState(state, scope) {
    for (let propertyName in this._valueBindings) {
      let b = this._valueBindings[ propertyName ];
      if (b.scope === scope && b.state === state){
        return b;
      }
    }
  }

  setView(viewController) {
    this.ctrl = viewController;
  }

  getView() {
    return this.ctrl;
  }

  setVisible(visible) {
    this._componentNode.style.display = (visible === 'true' || visible === true) ? "block" : "none";
  }

  setID(id) {
    if (id !== undefined){
      this._componentNode.setAttribute("id", id);
    }
  }

  setClass(className) {
    let cssClass = this.constructor.name + " " + (this._componentBaseClass ? this._componentBaseClass : "") + (className === undefined ? "" : " " + className);
    // this._componentNode.setAttribute("class", cssClass);
  }

  fireAction(action) {
    this.getView().getApplication().runAction(new action(), this.getView());
    // this.smartflow.runAction(new action(), this.getView());
  }

  removeChildNodes(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

}

