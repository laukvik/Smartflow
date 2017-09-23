import {InputComponent} from "../component";

export class Radio extends InputComponent {
  constructor(properties) {
    super(properties);
    this.inputs = [];
    this._componentNode = document.createElement("div");
  }

  setProperties(properties){
    this.setRequired(properties.required);
    this.setLabel(properties.label);
    this.setOptions(properties.options);
    this.setVertical(properties.vertical);
    this.setSelected(properties.selected);
    this.setValidationMessage(properties.validation);
  }

  buildComponent(builder, properties){
    this._componentNode.setAttribute("class", "sf-radio" + (properties.class ? " " + properties.class : ""));
    return this._componentNode;
  }

  isValid() {
    if (this.isRequired()) {
      return this.getSelected() !== undefined;
    }
    return true;
  }

  setEnabled(enabled) {
    for (let x = 0; x < this.inputs.length; x++) {
      this.inputs[x].disabled = enabled == false;
    }
  }

  getSelected() {
    for (let x = 0; x < this.inputs.length; x++) {
      let inp = this.inputs[x];
      if (inp.checked) {
        return inp;
      }
    }
  }

  setSelected(selected) {
    for (let x = 0; x < this.inputs.length; x++) {
      let inp = this.inputs[x];
      inp.checked = inp.value == selected;
    }
  }

  setVertical(isVertical) {
    this.vertical = isVertical === true;
    this._componentNode.setAttribute("class", "sf-radio " + (this.vertical ? "sf-radio-vertical" : "sf-radio-horisontal"));
  }

  isVertical() {
    return this.vertical;
  }

  setOptions(items) {
    this.removeChildNodes(this._componentNode);
    this.inputs = [];
    if (Array.isArray(items)) {
      var gui = "sf-radio-" + Math.round(100000);
      for (var x = 0; x < items.length; x++) {
        var item = items[x];
        var itemText = item.text;
        var itemValue = item.value;
        var span = document.createElement("label");
        span.setAttribute("class", "sf-radio-option");
        this._componentNode.appendChild(span);
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

