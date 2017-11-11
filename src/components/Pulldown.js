import {InputComponent} from "../InputComponent";
import {Collection} from "../Collection";

export class Pulldown extends InputComponent {

  constructor(properties) {
    super(properties);
    this.collections = new Collection();
    this._inputNode = document.createElement("select");
    this._inputNode.setAttribute("class", "form-control");
    this._inputNode.addEventListener('change', function () {
      this._changed();
    }.bind(this), false);
    this._itemKey = "value";
    this._itemLabel = "text";
  }

  setProperty(name, value) {
    if (name === "selected") {
      this.setSelected(value);
    } else if (name === "items") {
      this.setItems(value);
    } else if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "label") {
      this.setLabel(value);
    } else if (name === "required") {
      this.setRequired(value);
    } else if (name === "help") {
      this.setHelp(value);
    } else if (name === "vertical") {
      this.setVertical(value);
    } else if (name === "validation") {
      this.setValidationMessage(value);
    } else if (name === "itemKey") {
      this.setItemKey(value);
    } else if (name === "itemLabel") {
      this.setItemLabel(value);
    } else if (name === "sort") {
      this.setSort(value);
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

  setItemKey(itemKey){
    this._itemKey = itemKey;
  }

  setItemLabel(itemLabel){
    this._itemLabel = itemLabel;
  }

  getInputElement(){
    return this._inputNode;
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
      this._inputNode.removeAttribute("disabled");
    } else {
      this._inputNode.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this._inputNode.hasAttribute("disabled");
  }

  setItems(rowData) {
    this.removeChildNodes(this._inputNode);
    if (Array.isArray(rowData)) {
      this._items = rowData;
      let items = this.collections.find(rowData);
      let optionEmpty = document.createElement("option");
      optionEmpty.value = "";
      this._inputNode.appendChild(optionEmpty);
      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemText = item[ this._itemLabel ];
        let itemValue = item[ this._itemKey ];
        let option = document.createElement("option");
        option.setAttribute("value", itemValue);
        option.innerText = itemText;
        this._inputNode.appendChild(option);
      }
    }
  }

  getSelected() {
    if (this._inputNode.selectedIndex === 0) {
      return undefined;
    }
    return this._inputNode.options[this._inputNode.selectedIndex].value;
  }

  setSelected(selected) {
    for (let x = 0; x < this._inputNode.options.length; x++) {
      let opt = this._inputNode.options[x];
      opt.selected = opt.value == selected;
    }
  }

}

