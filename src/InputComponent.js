import {Component} from "./Component";


/**
 * InputComponent allows for user input, validation and error message.
 *
 * @private
 */
export class InputComponent extends Component {

  constructor(properties) {
    super(properties);
    this.comp = properties;
    this.createComponentNode("div");
    this._labelNode = document.createElement("label");
    this.getComponentNode().appendChild(this._labelNode);

    // Input Group
    this._inputGroup = document.createElement("div");
    this._inputGroup.setAttribute("class", "input-group");
    this.getComponentNode().appendChild(this._inputGroup);

    // Validation error
    this._errorNode = document.createElement("div");
    this._errorNode.setAttribute("class", "form-control-feedback");
    this.setError(null);
    this.getComponentNode().appendChild(this._errorNode);

    // Help
    this._helpNode = document.createElement("small");
    this._helpNode.setAttribute("class", "form-text text-muted");
    this._helpNode.style.display = "none";
    this.getComponentNode().appendChild(this._helpNode);

    this.setValidationMessage("Required");
    this.updateClass();
  }

  updateClass(){
    this.getComponentNode().setAttribute("class", "form-group" + (this._errorNode.innerText ? " has-danger" : ""));
  }

  updateInputGroup(){
    this._inputGroup.appendChild(this.getInputElement());
  }

  setHelp(text) {
    this._helpNode.textContent = text;
    this._helpNode.style.display = text? "block" : "none";
  }

  buildComponent(builder, properties) {
    this.updateInputGroup();
    return this.getComponentNode();
  }

  setRequired(required) {
    this._required = required === true;
  }

  isRequired() {
    return this._required;
  }

  setLabel(text) {
    this._labelNode.textContent = text;
  }

  setError(text) {
    this._errorNode.textContent = text ? text : null;
    this._errorNode.style.display = text? "block" : "none";
    this.updateClass();
  }

  validate() {
    if (this.isValid()) {
      this.setError("");
      return true;
    } else {
      this.setError(this._validationMessage);
      return false;
    }
  }

  setValidationMessage(message) {
    this._validationMessage = message;
  }

  getValidationMessage() {
    return this._validationMessage;
  }

}
