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
