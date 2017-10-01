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
    this.componentRootNode.setAttribute("class", "form-group");

    this._labelNode = document.createElement("legend");
    this._requiredNode = document.createElement("span");
    this._requiredNode.setAttribute("class", "text-danger");
    this._labelNode.appendChild(this._requiredNode);

    this.helpNode = document.createElement("small");
    this.helpNode.setAttribute("class", "form-text text-muted");
    this.helpNode.style.display = "none";

    this.errorNode = document.createElement("div");
    this.errorNode.setAttribute("class", "text-danger");

    this.setValidationMessage("Required");
  }

  setHelp(text) {
    this.helpNode.innerText = text;
    this.helpNode.style.display = text == undefined ? "none" : "block";
  }

  // Bygger HTML og adder listeners
  buildComponent(builder, properties) {
    return this._componentNode;
  }

  // TODO - Is Root node in use?
  setRootNode(componentNode) {
    this.componentNode = componentNode;
    this.removeChildNodes(this.componentRootNode);
    this.componentRootNode.appendChild(this._labelNode);
    this.componentRootNode.appendChild(componentNode);
    this.componentRootNode.appendChild(this.helpNode);
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
    this._requiredNode.innerText = this.required ? "*" : "";
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
    this._labelNode.innerText = text;
    this._requiredNode = document.createElement("span");
    this._requiredNode.setAttribute("class", "text-danger");
    this._labelNode.appendChild(this._requiredNode);
  }

  getLabel() {
    return this._labelNode.innerText;
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
