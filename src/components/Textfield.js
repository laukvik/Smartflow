class Textfield extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-textfield", comp.required);
    if (comp.rows) {
      this.input = document.createElement("textarea");
      this.input.setAttribute("rows", comp.rows);
      this.input.setAttribute("class", "sf-textfield-input");
    } else {
      this.input = document.createElement("input");
      this.input.setAttribute("type", "text");
      this.input.setAttribute("class", "sf-textfield-input");
    }
    this.input.setAttribute("placeholder", comp.placeholder);
    this.getBodyNode().appendChild(this.input);
    this.input.addEventListener('keyup', function () {
      this._changed();
    }.bind(this), false);
    this.setValue(comp.value);
    if (comp.validation) {
      this.setRegex(comp.validation.regex);
      this.validationMessage = comp.validation.message;
    }
    this.setRequired(comp.required);
    this.setLabel(comp.label);
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
