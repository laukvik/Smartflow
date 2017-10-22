import {InputComponent} from "../InputComponent";
import {Collection} from "../Collection";
import {Scope} from "../Scope";

/**
 *
 * @typedef {Object} RadioProperties
 * @property {string} type - always Radio
 * @property {string} label - the label
 * @property {boolean} required - indicates whether the value is required
 * @property {string} items - the items
 * @property {string} itemKey - the itemKey
 * @property {string} itemLabel - the itemLabel
 * @property {string} sort - the sort
 * @property {string} filter - the filter
 * @property {boolean} vertical - the direction
 *
 */

/**
 *
 *
 *
 */
export class Radio extends InputComponent {

  /**
   * Constructor for Radio
   *
   * @param {RadioProperties} properties the properties for the component
   */
  constructor(properties) {
    super(properties);
    this.inputNodes = [];
    this._items = [];
    this.collections = new Collection();
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
    } else if (name === "visible") {
      this.setVisible(value);
    } else if (name === "distinct") {
      this.setItemDistinct(value);
    }
  }

  setItemDistinct(itemDistinct){
    this._itemDistinct = itemDistinct;
    this.collections.setDistinct(this._itemDistinct);
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
      this.inputNodes[x].disabled = enabled === false;
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
      inp.checked = inp.value === selected;
    }
  }

  setSelectedIndex(index){
    for (let x = 0; x < this.inputNodes.length; x++) {
      let inp = this.inputNodes[x];
      inp.checked = x === index;
    }
  }

  setVertical(isVertical) {
    this.vertical = isVertical === true;
  }

  isVertical() {
    return this.vertical;
  }

  _changed(index) {
    let item = this._items[index];
    this.setSelectedIndex(index);
    this.firePropertyChanged("selected", item[ this._itemKey ]);
  }

  setItems(rowData) {
    this.removeChildNodes(this._componentNode);
    this.inputNodes = [];
    if (Array.isArray(rowData)) {
      let items = this.collections.find(rowData);
      this._items = rowData;
      let gui = "sf-radio-" + Math.random();
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
        text.innerText = itemText === "" ? String.fromCharCode(127, 32, 127) : itemText;

        let self = this;
        input.addEventListener("change", function () {
          self._changed(x);
        });
      }
    }
  }

}

