import {InputComponent} from "../component";

export class Pulldown extends InputComponent {
  
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("select");
    this._componentNode.setAttribute("class", "sf-pulldown");
    this._componentNode.addEventListener('change', function () {
      this._changed();
    }.bind(this), false);
  }

  setProperties(properties) {
    this.setOptions(properties.options);
    this.setSelected(properties.selected);
    this.setLabel(properties.label);
    this.setRequired(properties.required);
  }

  buildComponent(builder, properties) {
    this._componentNode.setAttribute("class", "sf-pulldown" + (properties.class ? " " + properties.class : ""));
    return this._componentNode;
  }

  _changed() {
    this.validate();
  }

  isValid() {
    if (this.isRequired()) {
      return this.getSelected() !== undefined;
    }
    return true;
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this._componentNode.removeAttribute("disabled");
    } else {
      this._componentNode.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this._componentNode.hasAttribute("disabled");
  }

  setOptions(items) {
    this.removeChildNodes(this._componentNode);
    if (Array.isArray(items)) {
      let optionEmpty = document.createElement("option");
      optionEmpty.value = "";
      this._componentNode.appendChild(optionEmpty);
      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemText = item.text;
        let itemValue = item.value;
        let option = document.createElement("option");
        option.setAttribute("value", itemValue);
        option.innerText = itemText;
        this._componentNode.appendChild(option);
      }
    }
  }

  getSelected() {
    if (this._componentNode.selectedIndex === 0) {
      return undefined;
    }
    return this._componentNode.options[this._componentNode.selectedIndex].value;
  }

  setSelected(selected) {
    for (var x = 0; x < this._componentNode.options.length; x++) {
      var opt = this._componentNode.options[x];
      opt.selected = opt.value == selected;
    }
  }

  stateChanged(state, value) {
    if (state == this.comp.states.selected) {
      this.setSelected(value);
    } else if (state == this.comp.states.options) {
      this.setOptions(value);
    } else if (state == this.comp.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.comp.states.label) {
      this.setLabel(value);
    } else if (state == this.comp.states.required) {
      this.setRequired(value);
    }
  }
}

