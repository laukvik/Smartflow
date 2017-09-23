/**
 *
 *
 */
class SmartflowComponent {
  constructor(properties) {
    this.properties = properties;
    this._stateListeners = [];
    this._componentNode = null;
    //this._componentID = properties.id;
    //this._componentClass = properties.class;
  }

  setProperties(properties) {
    this.setID(properties.id);
    this.setClass(properties.class);
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
    this._componentNode.setAttribute("id", id);
  }

  getID() {
    return this._componentID;
  }

  setClass(className) {
    this._componentClass = className;
    this._componentNode.setAttribute("class", className);
  }

  getClass() {
    return this._componentClass;
  }

  fireAction(action) {
    this.smartflow.runAction(new action(), this.getView());
  }

  fireState(state, value) {
    this.smartflow.fireStateChanged(state, value);
  }

  removeChildNodes(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  setStateBinding(states) {
    let arr = [];
    for (let key in states) {
      arr.push(states[key]);
    }
    this._stateListeners = arr;
  }

  getStateBinding() {
    return this._stateListeners;
  }

  fireComponentChanged(property, value) {
    this.smartflow.fireComponentChanged(this, property, value, this.ctrl);
  }
}

/**
 * Component for presentation
 *
 *
 */
class PresentationComponent extends SmartflowComponent {
  constructor(properties) {
    super(properties);
    this.componentRootNode = document.createElement("div");
  }

  buildComponent() {
    let div = document.createElement("div");
    div.innerText = "[Smartflow:" + this.constructor.name + "]";
    return div;
  }
}

/**
 *
 * Component for user input, validation and error message
 *
 * componentNode = hovedNo
 * containerNode =
 *
 */
class InputComponent extends SmartflowComponent {
  constructor(properties) {
    super(properties);
    this.comp = properties;
    this.componentRootNode = document.createElement("div");
    this.componentRootNode.setAttribute("class", "sf-" + this.constructor.name.toLowerCase());
    this.labelNode = document.createElement("div");
    this.labelNode.setAttribute("class", "sf-label");
    this.errorNode = document.createElement("div");
    this.errorNode.setAttribute("class", "sf-error");
    this.setValidationMessage("Required");
  }

  // Bygger HTML og adder listeners
  buildComponent(builder, properties) {
    return this._componentNode;
  }

  setRootNode(componentNode) {
    this.componentNode = componentNode;
    this.removeChildNodes(this.componentRootNode);
    this.componentRootNode.appendChild(this.labelNode);
    this.componentRootNode.appendChild(componentNode);
    this.componentRootNode.appendChild(this.errorNode);
  }

  getRootNode() {
    return this.componentRootNode;
  }

  validate() {
    return true;
  }

  setRequired(required) {
    this.required = required == true;
    this.labelNode.setAttribute("class", this.required ? "sf-label sf-required" : "sf-label");
  }

  isRequired() {
    return this.required;
  }

  setElement(node) {
    this._componentNode = node;
  }

  getElement() {
    return this._componentNode;
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

export {PresentationComponent, InputComponent, SmartflowComponent}
