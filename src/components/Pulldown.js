class Pulldown extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-pulldown", comp.required);

    this.select = document.createElement("select");
    this.select.setAttribute("class", "sf-pulldown-select");
    this.getBodyNode().appendChild(this.select);

    //var self = this;
    // this.select.addEventListener("change", function (evt) {
    //   self.fireComponentChanged("selection", {
    //     "value": evt.srcElement.value,
    //     "selected": evt.srcElement.selectedIndex
    //   });
    // }).bind(this, false);


    this.select.addEventListener('change', function () {
      this._changed();
    }.bind(this), false);

    this.setOptions(comp.options);
    this.setSelected(comp.selected);
    this.setEnabled(comp.enabled);
    this.setRequired(comp.required);
    this.setLabel(comp.label);
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
      this.select.removeAttribute("disabled");
    } else {
      this.select.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this.select.hasAttribute("disabled");
  }

  setOptions(items) {
    this.removeChildNodes(this.select);
    var optionEmpty = document.createElement("option");
    optionEmpty.value = "";
    this.select.appendChild(optionEmpty);

    for (var x = 0; x < items.length; x++) {
      var item = items[x];
      var itemText = item.text;
      var itemValue = item.value;
      var option = document.createElement("option");
      this.select.appendChild(option);
      option.setAttribute("value", itemValue);
      option.innerText = itemText;
    }
  }

  getSelected() {
    if (this.select.selectedIndex === 0) {
      return undefined;
    }
    return this.select.options[this.select.selectedIndex].value;
  }

  setSelected(selected) {
    for (var x = 0; x < this.select.options.length; x++) {
      var opt = this.select.options[x];
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

