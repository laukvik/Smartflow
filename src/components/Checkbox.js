import {InputComponent} from "../component";

/**
 *
 *
 * <div class="input-group">
 *     <span class="input-group-addon">
 *         <input type="checkbox" aria-label="Checkbox for following text input">
 *     </span>
 *     <span class="input-group-addon">$</span>
 *     <input type="text" class="form-control" aria-label="Text input with checkbox">
 * </div>
 *
 */
class Checkbox extends InputComponent {

  constructor(properties) {
    super(properties);
    this.divNodes = []; // each option
    this.inputNodes = []; // the input inside each option
    this._componentNode = document.createElement("div");

  }

  setProperties(properties) {
    this.setEnabled(properties.enabled);
    this.setRequired(properties.required);
    this.setLabel(properties.label);
    if (properties.validation) {
      this.setValidationMessage(properties.validation.message);
    }
    this.setOptions(properties.options);
    this.setSelected(properties.selected);
  }

  buildComponent(builder, properties) {
    return this._componentNode;
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
  }

  isVertical() {
    return this.vertical;
  }

  setEnabled(isEnabled) {
    for (let x = 0; x < this.inputNodes.length; x++) {
      this.inputNodes[x].disabled = isEnabled;
    }
  }

  setSelected(selected) {
    if (Array.isArray(selected)) {
      for (let x = 0; x < this.inputNodes.length; x++) {
        let inp = this.inputNodes[x];
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
    let s = this.inputNodes.filter(function (inp) {
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
    this.removeChildNodes(this._componentNode);
    if (Array.isArray(items)) {
      this.inputNodes = [];
      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemText = item.text;
        let itemValue = item.value;

        let div = document.createElement("div");
        this.divNodes.push(div);x
        div.setAttribute("class", "form-check" + this.isVertical() ? "" : " form-check-inline");
        this._componentNode.appendChild(div);

        let labelNode = document.createElement("label");
        labelNode.setAttribute("class", "form-check-label");
        div.appendChild(labelNode);

        let input = document.createElement("input");
        this.inputNodes.push(input);
        labelNode.appendChild(input);
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", itemValue);
        input.setAttribute("class", "form-check-input");

        let text = document.createElement("span");
        labelNode.appendChild(text);
        text.innerText = itemText;
        input.addEventListener("change", function (evt) {
          this._changed(evt);
        }.bind(this), false);

      }
    }
  }

  _changed() {
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

export {Checkbox}
