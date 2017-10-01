import {InputComponent} from "../component";
import {Collections} from "../collections";

export class Radio extends InputComponent {
  constructor(properties) {
    super(properties);
    this.inputNodes = [];
    this._items = [];
    this.collections = new Collections();
    this._componentNode = document.createElement("div");
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

  setItemKey(itemKey){
    this._itemKey = itemKey;
  }

  setItemLabel(itemLabel){
    this._itemLabel = itemLabel;
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

  setPaging(paging) {
    this.collections.setPaging(paging);
    this._update();
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

  setItems(rowData) {
    this.removeChildNodes(this._componentNode);
    this.inputNodes = [];
    if (Array.isArray(rowData)) {
      let items = this.collections.find(rowData);
      this._items = rowData;

      let gui = "sf-radio-" + Math.round(100000);
      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemText = item[ this._itemLabel ];
        let itemValue = item[ this._itemKey ];

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
        input.addEventListener("change", function () {
          self.firePropertyChanged("selected", inputs.filter(function (inp) {
            return inp.checked
          }));
        });
      }
    }
  }

}

