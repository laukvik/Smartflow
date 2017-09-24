import {InputComponent} from "../component";

export class Radio extends InputComponent {
  constructor(properties) {
    super(properties);
    this.inputNodes = [];
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
    return this._componentNode;
  }

  isValid() {
    if (this.isRequired()) {
      return this.getSelected() !== undefined;
    }
    return true;
  }

  setEnabled(enabled) {
    for (let x = 0; x < this.inputNodes.length; x++) {
      this.inputNodes[x].disabled = enabled == false;
    }
  }

  getSelected() {
    for (let x = 0; x < this.inputNodes.length; x++) {
      let inp = this.inputNodes[x];
      if (inp.checked) {
        return inp;
      }
    }
  }

  setSelected(selected) {
    for (let x = 0; x < this.inputNodes.length; x++) {
      let inp = this.inputNodes[x];
      inp.checked = inp.value == selected;
    }
  }

  setVertical(isVertical) {
    this.vertical = isVertical === true;
  }

  isVertical() {
    return this.vertical;
  }

  setOptions(items) {
    this.removeChildNodes(this._componentNode);
    this.inputNodes = [];
    if (Array.isArray(items)) {
      let gui = "sf-radio-" + Math.round(100000);
      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemText = item.text;
        let itemValue = item.value;

        let div = document.createElement("div");
        div.setAttribute("class", "form-check form-check-inline");
        this._componentNode.appendChild(div);

        let labelNode = document.createElement("label");
        labelNode.setAttribute("class", "form-check-label");
        div.appendChild(labelNode);

        let input = document.createElement("input");
        this.inputNodes.push(input);
        labelNode.appendChild(input);
        input.setAttribute("type", "radio");
        input.setAttribute("value", itemValue);
        input.setAttribute("name", gui);
        input.setAttribute("class", "form-check-input");

        let text = document.createElement("span");
        labelNode.appendChild(text);
        text.innerText = itemText;

        let inputs = this.inputNodes;
        let self = this;
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

