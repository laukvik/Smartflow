/**
 *
 *
 */
class SmartflowComponent {
  constructor(properties){
    this.properties = properties;
    this.stateListeners = [];
    this.componentID = properties.id;
  }

  buildComponent(){
    var div = document.createElement("div");
    div.innerText = "[Smartflow:"+ this.constructor.name +"]";
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

  setID(id) {
    this.componentID = id;
  }

  getID() {
    return this.componentID;
  }

  fireAction(action) {
    let func = eval(action);
    if (func == undefined) {
      console.warn("Action not found: ", action);
    } else {
      this.smartflow.runAction(new func(), this.getView());
    }
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
    this.stateListeners = arr;
  }

  getStateBinding() {
    return this.stateListeners;
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
  constructor(properties){
    super(properties);
    this.componentRootNode = document.createElement("div");
  }

  buildComponent(){
    var div = document.createElement("div");
    div.innerText = "[Smartflow:"+ this.constructor.name +"]";
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
class InputComponent extends SmartflowComponent{
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
    return this.rootNode;
  }

  setRootNode(componentNode){
    this.componentNode = componentNode;
    this.removeChildNodes(this.componentRootNode);
    this.componentRootNode.appendChild(this.labelNode);
    this.componentRootNode.appendChild(componentNode);
    this.componentRootNode.appendChild(this.errorNode);
  }

  getRootNode(){
    return this.componentRootNode;
  }

  validate(){
    return true;
  }

  setRequired(required){
    this.required = required == true;
    this.labelNode.setAttribute("class", this.required ? "sf-label sf-required" : "sf-label");
  }

  isRequired(){
    return this.required;
  }

  setElement(node) {
    this.rootNode = node;
  }

  getElement() {
    return this.rootNode;
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
