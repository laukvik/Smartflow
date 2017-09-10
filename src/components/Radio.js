class Radio extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-radio", comp.required);
    this.optionsNode = document.createElement("div");
    this.getElement().appendChild(this.optionsNode);
    this.inputs = [];
    this.setOptions(comp.options);
    this.setVertical(comp.vertical);
    this.setSelected(comp.selected);
    this.setLabel(comp.label);
    this.setRequired(comp.required);
  }

  isValid() {
    if (this.isRequired()) {
      return this.getSelected() !== undefined;
    }
    return true;
  }

  setEnabled(isEnabled) {
    for (var x = 0; x < this.inputs.length; x++) {
      this.inputs[x].disabled = true;
    }
  }

  getSelected() {
    for (var x = 0; x < this.inputs.length; x++) {
      var inp = this.inputs[x];
      if (inp.checked) {
        return inp;
      }
    }
  }

  setSelected(selected) {
    for (var x = 0; x < this.inputs.length; x++) {
      var inp = this.inputs[x];
      inp.checked = inp.value == selected;
    }
  }

  setVertical(isVertical) {
    this.vertical = isVertical;
    this.getElement().setAttribute("class", "sf-radio " + (isVertical ? "sf-radio-vertical" : "sf-radio-horisontal"));
  }

  isVertical() {
    return this.vertical;
  }

  setOptions(items) {
    if (Array.isArray(items)) {
      this.inputs = [];
      this.removeChildNodes(this.optionsNode);
      var gui = "sf-radio-" + Math.round(100000);
      for (var x = 0; x < items.length; x++) {
        var item = items[x];
        var itemText = item.text;
        var itemValue = item.value;
        var span = document.createElement("label");
        span.setAttribute("class", "sf-radio-option");
        this.optionsNode.appendChild(span);
        var input = document.createElement("input");
        this.inputs.push(input);
        span.appendChild(input);
        input.setAttribute("type", "radio");
        input.setAttribute("value", itemValue);
        input.setAttribute("name", gui);
        var text = document.createElement("span");
        span.appendChild(text);
        text.setAttribute("class", "sf-radio-option-label");
        text.innerText = itemText;
        var inputs = this.inputs;
        var self = this;
        input.addEventListener("change", function (evt) {
          self.fireComponentChanged("selection", {
            "value": evt.srcElement.value,
            "selected": inputs.filter(function (inp) {
              return inp.checked
            }).map(function (inp, index) {
              return index;
            })
          });
        });
      }
    } else {
      console.warn("Radio.setOptions: ", items);
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
