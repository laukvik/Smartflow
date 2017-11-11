import {InputComponent} from "../InputComponent";
import {Collection} from "../Collection";

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
 * @private
 */
class Checkbox extends InputComponent {

  constructor(properties) {
    super(properties);
    this.collections = new Collection();
    this._items = [];
    this.divNodes = []; // each option
    this.inputNodes = []; // the input inside each option
    this._inputNode = document.createElement("div");
    this._itemKey = "value";
    this._itemLabel = "text";
  }

  setProperty(name, value) {
    if (name === "selected") {
      this.setSelected(value);
    } else if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "label") {
      this.setLabel(value);
    } else if (name === "required") {
      this.setRequired(value);
    } else if (name === "vertical") {
      this.setVertical(value);
    } else if (name === "validation") {
      this.setValidationMessage(value);

    } else if (name === "items") {
      this.setItems(value);
    } else if (name === "itemKey") {
      this.setItemKey(value);
    } else if (name === "itemLabel") {
      this.setItemLabel(value);
    } else if (name === "sort") {
      this.setSort(value);
    } else if (name === "filter") {
      this.setFilter(value);
    } else if (name === "distinct") {
      this.setItemDistinct(value);
    } else if (name === "filter") {
      this.setFilter(value);
    }
  }

  _update() {
    this.setItems(this._items);
  }

  setSort(sort) {
    this.collections.setSort(sort);
    this._update();
  }

  setFilter(filter) {
    if (Array.isArray(filter)) {
      this.collections.setFilter(filter);
      this._update();
    } else {
      this.filter = [];
    }
  }

  setItemDistinct(itemDistinct){
    this._itemDistinct = itemDistinct;
    this.collections.setDistinct(this._itemDistinct);
  }

  setPaging(paging) {
    this.collections.setPaging(paging);
    this._update();
  }

  setItemKey(itemKey){
    this._itemKey = itemKey;
  }

  setItemLabel(itemLabel){
    this._itemLabel = itemLabel;
  }

  setProperties(properties) {
    this.setEnabled(properties.enabled);
    this.setLabel(properties.label);
    this.setRequired(properties.required);
    if (properties.validation) {
      this.setValidationMessage(properties.validation.message);
    }
    this.setItems(properties.options);
    this.setSelected(properties.selected);
  }

  getInputElement(){
    return this._inputNode;
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

  setItems(rowData) {
    this.removeChildNodes(this._inputNode);
    if (Array.isArray(rowData)) {
      this._items = rowData;
      let items = this.collections.find(rowData);
      this.inputNodes = [];
      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemText = item[ this._itemLabel ];
        let itemValue = item[ this._itemKey ];

        let div = document.createElement("div");
        this.divNodes.push(div);x
        div.setAttribute("class", "form-check" + this.isVertical() ? "" : " form-check-inline");
        this._inputNode.appendChild(div);

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

}

export {Checkbox}
