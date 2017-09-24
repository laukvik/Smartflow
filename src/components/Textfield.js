import {InputComponent} from "../component";

export class Textfield extends InputComponent {
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");

    this._iconBefore = null;
    this._iconAfter = null;
  }

  setProperties(properties){
    this.setRequired(properties.required);
    this.setLabel(properties.label);
    if (properties.validation){
      this.setValidationMessage(properties.validation.message);
      this.setRegex(properties.validation.regex);
    }
    this.setHelp(properties.help);
  }

  buildComponent(builder, properties) {
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

    this.inputNode.setAttribute("placeholder", properties.placeholder);
    this.inputNode.addEventListener('keyup', function () {
      this._changed();
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

  _changed() {
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
    this.inputNode.setAttribute("placeholder", text);
  }

  getPlaceholder() {
    return this.inputNode.getAttribute("placeholder");
  }

  setValue(text) {
    this.inputNode.value = text == undefined ? "" : text;
  }

  getValue() {
    var s = this.inputNode.value;
    return s === undefined ? '' : s;
  }

  stateChanged(state, value) {
    if (state == this.comp.states.value) {
      this.setValue(value);
    } else if (state == this.comp.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.comp.states.label) {
      this.setLabel(value);
    } else if (state == this.comp.states.required) {
      this.setRequired(value);
    }
  }
}
