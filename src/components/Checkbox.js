class Checkbox extends InputComponent {
  constructor(properties, ctrl, builder) {
    super(properties, ctrl, builder);
    this.inputs = [];
    this.optionsNode = document.createElement("div");
    this.optionsNode.setAttribute("class", "sf-checkbox-options")
  }

  buildComponent(builder, properties){
    this.setEnabled(properties.enabled);
    this.setRequired(properties.required);
    this.setLabel(properties.label);
    if (properties.validation) {
      this.setValidationMessage(properties.validation.message);
    }
    this.setOptions(properties.options);
    this.setSelected(properties.selected);
    return this.optionsNode;
  }

  isValid() {
    if (this.isRequired()) {
      var arr = this.getSelected();
      return arr.length > 0;
    }
    return true;
  }

  setVertical(isVertical) {
    this.vertical = isVertical == true;
    this.getElement().setAttribute("class", "sf-checkbox " + (isVertical ? "sf-checkbox-vertical" : "sf-checkbox-horisontal"));
  }

  isVertical() {
    return this.vertical;
  }

  setEnabled(isEnabled) {
    for (let x = 0; x < this.inputs.length; x++) {
      this.inputs[x].disabled = isEnabled;
    }
  }

  setSelected(selected) {
    if (Array.isArray(selected)){
      for (let x = 0; x < this.inputs.length; x++) {
        let inp = this.inputs[x];
        let found = false;
        for (let y = 0; y < selected.length; y++) {
          let selectedValue = selected[y];
          if (inp.value == selectedValue) {
            found = true;
          }
        }
        inp.checked = found;
      }
    }
  }

  getSelected() {
    let s = this.inputs.filter(function (inp) {
      return inp.checked
    }).map(function (inp, index) {
      return index;
    });
    if (!Array.isArray(s)) {
      return [];
    } else {
      return s;
    }
  }

  setOptions(items) {
    if (Array.isArray(items)) {
      this.inputs = [];
      this.removeChildNodes(this.optionsNode);
      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemText = item.text;
        let itemValue = item.value;
        let span = document.createElement("label");
        span.setAttribute("class", "sf-checkbox-option");
        this.optionsNode.appendChild(span);
        let input = document.createElement("input");
        this.inputs.push(input);
        span.appendChild(input);
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", itemValue);
        let text = document.createElement("span");
        span.appendChild(text);
        text.setAttribute("class", "sf-checkbox-option-label");
        text.innerText = itemText;
        // var self = this;
        // var inputs = this.inputs;
        // input.addEventListener("change", function (evt) {
        //   self.fireComponentChanged("selection", {
        //     "value": evt.srcElement.value,
        //     "selected": inputs.filter(function(inp){ return inp.checked}).map(function(inp, index){
        //       return index;
        //     })
        //   });
        // });

        input.addEventListener("change", function (evt) {
          this._changed(evt);
        }.bind(this), false);

      }
    } else {
      console.warn("Checkbox: Not an array: ", items)
    }
  }

  _changed(evt) {
    this.validate();
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
