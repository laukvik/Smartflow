import {InputComponent} from "../component";

export class Pulldown extends InputComponent {
  constructor(properties) {
    super(properties);
    this.selectNode = document.createElement("select");
    this.selectNode.setAttribute("class", "sf-pulldown");
    this.selectNode.addEventListener('change', function () {
      this._changed();
    }.bind(this), false);
  }

  buildComponent(builder, properties){
    this.setOptions(properties.options);
    this.setSelected(properties.selected);
    this.setLabel(properties.label);
    this.setRequired(properties.required);
    if (properties.id){
      this.selectNode.setAttribute("id", properties.id);
    }
    this.selectNode.setAttribute("class", "sf-pulldown" + (properties.class ? " " + properties.class : ""));
    return this.selectNode;
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
      this.selectNode.removeAttribute("disabled");
    } else {
      this.selectNode.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this.selectNode.hasAttribute("disabled");
  }

  setOptions(items) {
    this.removeChildNodes(this.selectNode);
    if (Array.isArray(items)) {
      let optionEmpty = document.createElement("option");
      optionEmpty.value = "";
      this.selectNode.appendChild(optionEmpty);
      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemText = item.text;
        let itemValue = item.value;
        let option = document.createElement("option");
        option.setAttribute("value", itemValue);
        option.innerText = itemText;
        this.selectNode.appendChild(option);
      }
    }
  }

  getSelected() {
    if (this.selectNode.selectedIndex === 0) {
      return undefined;
    }
    return this.selectNode.options[this.selectNode.selectedIndex].value;
  }

  setSelected(selected) {
    for (var x = 0; x < this.selectNode.options.length; x++) {
      var opt = this.selectNode.options[x];
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

