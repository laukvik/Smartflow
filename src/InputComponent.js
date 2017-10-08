import {Component} from "./Component";


/**
 *
 * Component for user input, validation and error message
 *
 * componentNode = hovedNo
 * containerNode =
 *
 */
export class InputComponent extends Component {
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
    this.componentRootNode.appendChild(this.errorNode);
    this.componentRootNode.appendChild(componentNode);
    this.componentRootNode.appendChild(this.helpNode);
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
