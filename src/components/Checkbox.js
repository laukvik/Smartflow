class Checkbox extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-checkbox", comp.required);
    this.optionsNode = document.createElement("div");
    this.getBodyNode().appendChild(this.optionsNode);
    this.setOptions(comp.options);
    this.setSelected(comp.selected);
    this.setLabel(comp.label);
    this.setRequired(comp.required);
  }

  isValid() {
    if (this.isRequired()) {
      var arr = this.getSelected();
      return arr.length > 0;
    }
    return true;
  }

  setVertical(isVertical) {
    this.vertical = isVertical;
    this.getElement().setAttribute("class", "sf-checkbox " + (isVertical ? "sf-checkbox-vertical" : "sf-checkbox-horisontal"));
  }

  isVertical() {
    return this.vertical;
  }

  setEnabled(isEnabled) {
    for (var x = 0; x < this.inputs.length; x++) {
      this.inputs[x].disabled = isEnabled;
    }
  }

  setSelected(selected) {
    for (var x = 0; x < this.inputs.length; x++) {
      var inp = this.inputs[x];
      var found = false;
      for (var y = 0; y < selected.length; y++) {
        var val = selected[y];
        if (inp.value == val) {
          found = true;
        }
      }
      inp.checked = found;
    }
  }

  getSelected() {
    var s = this.inputs.filter(function (inp) {
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
      for (var x = 0; x < items.length; x++) {
        var item = items[x];
        var itemText = item.text;
        var itemValue = item.value;
        var span = document.createElement("label");
        span.setAttribute("class", "sf-checkbox-option");
        this.optionsNode.appendChild(span);
        var input = document.createElement("input");
        this.inputs.push(input);
        span.appendChild(input);
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", itemValue);
        var text = document.createElement("span");
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
