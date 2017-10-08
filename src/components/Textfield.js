import {InputComponent} from "../InputComponent";

export class Textfield extends InputComponent {
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
    this._iconBefore = null;
    this._iconAfter = null;
    this._value = "";
  }

  setProperty(name, value) {
    if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "value") {
      this.setValue(value);
    } else if (name === "label") {
      this.setLabel(value);
    } else if (name === "required") {
      this.setRequired(value);
    } else if (name === "help") {
      this.setHelp(value);
    } else if (name === "regex") {
      this.setRegex(value);
    } else if (name === "validation") {
      this.setValidationMessage(value);
    } else if (name === "placeholder") {
      this.setPlaceholder(value);
    }
  }

  buildComponent(builder, properties) {
    this._properties = properties;
    this._componentNode.setAttribute("class", "input-group");
    if (properties.rows) {
      this.inputNode = document.createElement("textarea");
      this.inputNode.setAttribute("rows", properties.rows);
      this.inputNode.setAttribute("class", "form-control");
    } else {
      this.inputNode = document.createElement("input");
      this.inputNode.setAttribute("type", "text");
      this.inputNode.setAttribute("class", "form-control");
    }

    this.inputNode.addEventListener('keyup', function () {
      this._valueChanged();
    }.bind(this), false);



    if (properties.before) {
      let addonBefore = document.createElement("span");
      addonBefore.setAttribute("class", "input-group-addon");
      if (properties.before.text) {
        addonBefore.innerText = properties.before.text;
      }
      if (properties.before.icon){
        let iconBefore = document.createElement("span");
        iconBefore.setAttribute("class", "glyphicon " + properties.before.icon);
        addonBefore.appendChild(iconBefore);
      }
      this._componentNode.appendChild(addonBefore);
    }


    this._componentNode.appendChild(this.inputNode);

    if (properties.after) {
      let addonAfter = document.createElement("span");
      addonAfter.setAttribute("class", "input-group-addon");
      if (properties.after.text){
        addonAfter.innerText = properties.after.text;
      }
      if (properties.after.icon){
        let iconAfter = document.createElement("span");
        iconAfter.setAttribute("class", "glyphicon " + properties.icon_after);
        addonAfter.appendChild(iconAfter);
      }
      this._componentNode.appendChild(addonAfter);
    }

    return this._componentNode;
  }

  _valueChanged() {
    if (this._value === this.getValue()) {
      return;
    }
    this._value = this.getValue();
    this.firePropertyChanged("value", this._value);
    this.validate();
  }

  isValid() {
    if (this.getValue() === '') {
      if (this.isRequired()) {
        return false;
      }
    }
    if (this.regex === undefined) {
      // No validation
      if (this.isRequired()) {
        return this.inputNode.value.length > 0;
      }
      return true;
    }
    return this.regex.test(this.inputNode.value);
  }

  setRegex(regex) {
    if (regex === undefined) {
      this.regex = undefined;
    }
    this.regex = new RegExp(regex);
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.inputNode.removeAttribute("disabled");
    } else {
      this.inputNode.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this.inputNode.hasAttribute("disabled");
  }

  setPlaceholder(text) {
    this.inputNode.setAttribute("placeholder", text === undefined ? "" : text);
  }

  getPlaceholder() {
    return this.inputNode.getAttribute("placeholder");
  }

  setValue(text) {
    this.inputNode.value = text === undefined ? "" : text;
  }

  getValue() {
    let s = this.inputNode.value;
    return s === undefined ? '' : s;
  }

}
