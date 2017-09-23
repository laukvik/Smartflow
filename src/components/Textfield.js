import {InputComponent} from "../component";

export class Textfield extends InputComponent {
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
    this._componentNode.setAttribute("class", "input-group");
  }

  setProperties(properties){
    this.setRequired(properties.required);
    this.setLabel(properties.label);
    if (properties.validation){
      this.setValidationMessage(properties.validation.message);
      this.setRegex(properties.validation.regex);
    }
  }

  buildComponent(builder, properties) {
    if (properties.rows) {
      this.input = document.createElement("textarea");
      this.input.setAttribute("rows", properties.rows);
      this.input.setAttribute("class", "form-control");
    } else {
      this.input = document.createElement("input");
      this.input.setAttribute("type", "text");
      this.input.setAttribute("class", "form-control");
    }

    this.input.setAttribute("placeholder", properties.placeholder);
    this.input.addEventListener('keyup', function () {
      this._changed();
    }.bind(this), false);



    if (properties.icon_before) {
      let addonBefore = document.createElement("span");
      addonBefore.setAttribute("class", "input-group-addon");
      let iconBefore = document.createElement("span");
      iconBefore.setAttribute("class", "glyphicon " + properties.icon_before);
      addonBefore.appendChild(iconBefore);
      this._componentNode.appendChild(addonBefore);
    }


    this._componentNode.appendChild(this.input);

    if (properties.icon_after) {
      let addonAfter = document.createElement("span");
      addonAfter.setAttribute("class", "input-group-addon");
      let iconAfter = document.createElement("span");
      iconAfter.setAttribute("class", "glyphicon " + properties.icon_after);
      addonAfter.appendChild(iconAfter);
      this._componentNode.appendChild(addonAfter);
    }

    this._componentNode.setAttribute("class", "sf-textfield input-group" + (properties.class ? " " + properties.class : ""));

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
        return this.input.value.length > 0;
      }
      return true;
    }
    return this.regex.test(this.input.value);
  }

  setRegex(regex) {
    if (regex === undefined) {
      this.regex = undefined;
    }
    this.regex = new RegExp(regex);
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.input.removeAttribute("disabled");
    } else {
      this.input.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this.input.hasAttribute("disabled");
  }

  setPlaceholder(text) {
    this.input.setAttribute("placeholder", text);
  }

  getPlaceholder() {
    return this.input.getAttribute("placeholder");
  }

  setValue(text) {
    this.input.value = text == undefined ? "" : text;
  }

  getValue() {
    var s = this.input.value;
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
