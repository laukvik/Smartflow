import {InputComponent} from "../component";

export class Textfield extends InputComponent {
  constructor(comp) {
    super(comp);
    this.rootNode = document.createElement("div");
    this.rootNode.setAttribute("class", "input-group");
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

    this.setRequired(properties.required);
    this.setLabel(properties.label);
    if (properties.validation){
      this.setValidationMessage(properties.validation.message);
      this.setRegex(properties.validation.regex);
    }

    if (properties.icon_before) {
      var addonBefore = document.createElement("span");
      addonBefore.setAttribute("class", "input-group-addon");
      let iconBefore = document.createElement("span");
      //iconBefore.setAttribute("class", "glyphicon glyphicon-calendar");
      iconBefore.setAttribute("class", "glyphicon " + properties.icon_before);
      addonBefore.appendChild(iconBefore);
      this.rootNode.appendChild(addonBefore);
    }


    this.rootNode.appendChild(this.input);

    if (properties.icon_after) {
      var addonAfter = document.createElement("span");
      addonAfter.setAttribute("class", "input-group-addon");
      let iconAfter = document.createElement("span");
      //iconAfter.setAttribute("class", "glyphicon glyphicon-calendar");
      iconAfter.setAttribute("class", "glyphicon " + properties.icon_after);
      addonAfter.appendChild(iconAfter);
      this.rootNode.appendChild(addonAfter);
    }


    return this.rootNode;
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
